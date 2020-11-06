import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useMemo, useState } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { ChartTimeControls } from '~/components-styled/chart-time-controls';
import { createDate } from '~/utils/createDate';
import { Utils, formatDateFromMilliseconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';
import styles from './areaChart.module.scss';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
}

type TRange = [Date, number | null, number | null];
type TLine = [Date, number | null];

const SIGNAALWAARDE_Z_INDEX = 5;

interface AreaChartProps {
  title: string;
  description?: string;
  rangeLegendLabel: string;
  lineLegendLabel: string;
  data: Array<{
    avg: number | null;
    date: number;
    min: number | null;
    max: number | null;
  }>;
  signaalwaarde?: number;
  signaalwaardeLabel?: string;
  timeframeOptions?: TimeframeOption[];
}

type IGetOptions = Omit<AreaChartProps, 'data' | 'title' | 'description'> & {
  utils: Utils;
  rangeData: TRange[];
  lineData: TLine[];
};

export default function AreaChart(props: AreaChartProps) {
  const {
    rangeLegendLabel,
    lineLegendLabel,
    data,
    signaalwaarde,
    timeframeOptions,
    title,
    description,
  } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  const rangeData: TRange[] = useMemo(() => {
    return data.map((d) => [createDate(d.date), d.min, d.max]);
  }, [data]);

  const lineData: TLine[] = useMemo(() => {
    return data.map((value) => {
      return [createDate(value.date), value.avg];
    });
  }, [data]);

  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const { utils } = siteText;
    const signaalwaardeLabel = siteText.common.barScale.signaalwaarde;
    const getOptionsThunk = (rangeData: TRange[], lineData: TLine[]) =>
      getChartOptions({
        utils,
        rangeData,
        lineData,
        signaalwaarde,
        signaalwaardeLabel,
        rangeLegendLabel,
        lineLegendLabel,
      });

    const filteredRange = getFilteredValues<TRange>(
      rangeData,
      timeframe,
      (value: TRange) => value[0].getTime()
    );

    const filteredLine = getFilteredValues<TLine>(
      lineData,
      timeframe,
      (value: TLine) => value[0].getTime()
    );

    return getOptionsThunk(filteredRange, filteredLine);
  }, [
    lineData,
    rangeData,
    signaalwaarde,
    lineLegendLabel,
    rangeLegendLabel,
    timeframe,
    siteText,
  ]);

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleAndDescription}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
        <div className={styles.timeControls}>
          <ChartTimeControls
            timeframe={timeframe}
            timeframeOptions={timeframeOptions}
            onChange={(value) => setTimeframe(value)}
            timeControls={siteText.charts.time_controls}
          />
        </div>
      </header>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </section>
  );
}

function getChartOptions(props: IGetOptions): Highcharts.Options {
  const {
    utils,
    rangeData,
    signaalwaarde,
    signaalwaardeLabel,
    lineData,
    rangeLegendLabel,
    lineLegendLabel,
  } = props;

  /**
   * Adding an absolute value to the yMax like in LineChart doesn't seem to
   * work well for AreaChart given the values it is rendered with. So for
   * now we use a (relative) 20% increase.
   */
  const PADDING_INCREASE = 1.2;

  const yMax = calculateYMax(
    rangeData,
    (signaalwaarde || -Infinity) * PADDING_INCREASE
  );

  const options: Highcharts.Options = {
    chart: {
      alignTicks: true,
      animation: false,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      className: 'undefined',
      colorCount: 10,
      displayErrors: true,
      height: 175,
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      categories: rangeData.map((el) => el[0].getTime() as any),
      title: {
        text: null,
      },
      labels: {
        align: 'right',
        x: 10,
        /**
         * The number 0 doesn't work properly, probably because highcharts does
         * some buggy `if(labels.rotation) {}` which yields false for the number 0.
         */
        rotation: ('0' as unknown) as number,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromMilliseconds(utils, this.value, 'axis')
            : '';
        },
      },
    },
    yAxis: {
      min: 0,
      max: yMax,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function (): string {
          return formatNumber(this.value);
        },
      },
      plotLines: signaalwaarde
        ? [
            {
              value: signaalwaarde,
              width: 1,
              color: '#4f5458',
              dashStyle: 'Dash',
              zIndex: SIGNAALWAARDE_Z_INDEX,
              label: {
                text: signaalwaardeLabel,
                align: 'right',
                y: -8,
                x: 0,
                style: {
                  color: '#4f5458',
                },
              },
            },
            /**
             * In order to show the value of the signaalwaarde, we plot a second
             * transparent line, and only use its label positioned at the
             * y-axis.
             */
            {
              value: signaalwaarde,
              color: 'transparent',
              zIndex: SIGNAALWAARDE_Z_INDEX,
              label: {
                text: `${signaalwaarde}`,
                align: 'left',
                y: -8,
                x: 0,
                style: {
                  color: '#4f5458',
                },
              },
            },
          ]
        : undefined,
    },

    tooltip: {
      shared: true,
      valueSuffix: 'R',
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      xDateFormat: '%d %b %y',
      formatter() {
        const rangePoint = rangeData.find((el) => el[0].getTime() === this.x);

        if (!rangePoint) return;

        const [, minRangePoint, maxRangePoint] = rangePoint;
        const linePoint = lineData.find((el) => el[0].getTime() === this.x);
        const x = this.x;
        return `
            ${formatDateFromMilliseconds(utils, x, 'medium')}<br/>
            <strong>${rangeLegendLabel}</strong> ${formatNumber(
          minRangePoint
        )} - ${formatNumber(maxRangePoint)}<br/>
            <strong>${lineLegendLabel}</strong> ${
          linePoint ? formatNumber(linePoint[1] as number) : '–'
        }
          `;
      },
    },

    series: [
      {
        name: rangeLegendLabel,
        data: rangeData,
        type: 'arearange',
        color: '#C4C4C4',
        marker: {
          enabled: false,
        },
      },
      {
        name: lineLegendLabel,
        data: lineData.map((el) => el[1] as number),
        type: 'line',
        color: '#3391CC',
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  return options;
}

/**
 * From all the defined range values, extract the highest number so we know how to
 * scale the y-axis
 */
function calculateYMax(values: TRange[], paddedSignaalwaarde: number) {
  const flatValues = values
    /**
     * Better data type definitions will avoid having to deal with this stuff in
     * the future.
     */
    .filter(([_date, a, b]) => a !== null && b !== null)
    .flatMap(([_date, a, b]) => [a, b] as [number, number]);

  return Math.max(paddedSignaalwaarde, ...flatValues);
}
