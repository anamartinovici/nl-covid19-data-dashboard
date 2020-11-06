import { useRouter } from 'next/router';
import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { Spacer } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { SafetyRegionChoropleth } from '~/components/choropleth/SafetyRegionChoropleth';
import { createSelectRegionHandler } from '~/components/choropleth/selectHandlers/createSelectRegionHandler';
import { createSewerRegionalTooltip } from '~/components/choropleth/tooltips/region/createSewerRegionalTooltip';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { Metadata } from '~/components-styled/metadata';

const SewerWater: FCWithLayout<INationalData> = ({ data }) => {
  const sewerAverages = data.sewer;
  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData('sewer');

  const { siteText }: ILocale = useContext(LocaleContext);
  const text = siteText.rioolwater_metingen;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_weekRangeHack
        category={siteText.gemeente_layout.headings.overig}
        title={text.titel}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          weekStartUnix: sewerAverages.last_value.week_start_unix,
          weekEndUnix: sewerAverages.last_value.week_end_unix,
          dateOfInsertionUnix: sewerAverages.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      {/*
        @TODO make this replace the code below. Maybe extend TwoKpiSection so that
        it renders the KPI full-width if there is only one child.

        Discuss with design. https://trello.com/c/gnDOKkZ2/780-regressie-gemiddeld-aantal-besmettelijke-mensen-per-100k


      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: [sewerAverages.last_value.week_start_unix, sewerAverages.last_value.week_end_unix],
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={sewerAverages.last_value.average}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
          />
        </KpiTile>
        <KpiTile
          title={text.total_installation_count_titel}
          description={
            text.total_installation_count_description +
            `<p style="color:#595959">${text.rwzi_abbrev}</p>`
          }
          metadata={{
            date: [sewerAverages.last_value.week_start_unix, sewerAverages.last_value.week_end_unix],
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={sewerAverages.last_value.total_installation_count}
          />
        </KpiTile>
      </TwoKpiSection>
        */}

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(sewerAverages.last_value.average)}
          </p>

          <Metadata
            date={[
              sewerAverages.last_value.week_start_unix,
              sewerAverages.last_value.week_end_unix,
            ]}
            source={text.bron}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
          <ValueAnnotation>x100 miljard</ValueAnnotation>
        </div>
      </article>
      <Spacer mb={4} />

      <LineChartTile
        title={text.linechart_titel}
        timeframeOptions={['all', '5weeks']}
        values={sewerAverages.values.map((value) => ({
          value: Number(value.average),
          date: value.week_unix,
          week: {
            start: value.week_start_unix,
            end: value.week_end_unix,
          },
        }))}
        metadata={{
          source: text.bron,
        }}
        formatTooltip={(x) => {
          return `<strong>${formatDateFromSeconds(
            siteText.utils,
            x.week.start,
            'short'
          )} - ${formatDateFromSeconds(
            siteText.utils,
            x.week.end,
            'short'
          )}:</strong> ${formatNumber(x.value)}`;
        }}
        valueAnnotation={siteText.waarde_annotaties.riool_normalized}
      />

      <ChoroplethTile
        title={text.map_titel}
        description={text.map_toelichting}
        metadata={{
          date: [
            sewerAverages.last_value.week_start_unix,
            sewerAverages.last_value.week_end_unix,
          ],
          source: text.bron,
        }}
        legend={
          legendItems // this data value should probably not be optional
            ? {
                title: text.legenda_titel,
                items: legendItems,
              }
            : undefined
        }
      >
        <SafetyRegionChoropleth
          metricName="sewer"
          metricValueName="average"
          tooltipContent={createSewerRegionalTooltip(router)}
          onSelect={createSelectRegionHandler(router, 'rioolwater')}
        />
      </ChoroplethTile>
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SewerWater;
