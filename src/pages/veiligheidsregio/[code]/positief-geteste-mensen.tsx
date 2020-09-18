import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import siteText from 'locale';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { ResultsPerRegion } from 'types/data.d';

import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from 'static-props/safetyregion-data';
import { getLocalTitleForRegion } from 'utils/getLocalTitleForCode';
import positiveTestedPeopleTooltip from 'components/chloropleth/tooltips/municipal/positiveTestedPeopleTooltip';
import MunicipalityLegenda from 'components/chloropleth/legenda/MunicipalityLegenda';
import MunicipalityChloropleth from 'components/chloropleth/MunicipalityChloropleth';
import regionCodeToMunicipalCodeLookup from 'data/regionCodeToMunicipalCodeLookup';

const text: typeof siteText.veiligheidsregio_positief_geteste_personen =
  siteText.veiligheidsregio_positief_geteste_personen;

export function PostivelyTestedPeopleBarScale(props: {
  data: ResultsPerRegion | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_increase_per_region}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 7,
        },
        {
          color: '#f35065',
          value: 10,
        },
      ]}
      signaalwaarde={7}
      showAxis={showAxis}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data } = props;

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={getLocalTitleForRegion(text.titel, data.code)}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            resultsPerRegion?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />
      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {resultsPerRegion && (
            <PostivelyTestedPeopleBarScale
              data={resultsPerRegion}
              showAxis={true}
            />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {resultsPerRegion && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(
                  Math.round(
                    resultsPerRegion.last_value
                      .total_reported_increase_per_region
                  )
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>
      {resultsPerRegion && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            values={resultsPerRegion.values.map((value) => ({
              value: value.infected_increase_per_region,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={7}
          />
        </article>
      )}
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForRegion(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>

          <MunicipalityLegenda
            metricName="positive_tested_people"
            title={siteText.positief_geteste_personen.chloropleth_legenda.titel}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityChloropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            metricName="positive_tested_people"
            tooltipContent={positiveTestedPeopleTooltip}
          />
        </div>
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
