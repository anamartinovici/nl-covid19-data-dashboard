import Getest from '~/assets/test.svg';
import { Box } from '~/components-styled/base';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

const text = siteText.verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = ({ data }) => {
  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.nursing_home.last_value.date_of_report_unix,
          dateInsertedUnix: data.nursing_home.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      {/**
       * @TODO we need to figure out how to apply these margins on a more generic approach.
       * Note that we cannot use the KpiSection component because that, combined with a
       * KpiTile, renders a nested shadow. The DoubleKpiSection does not render that shadow,
       * which imho implies that we need to rethink names and/or implementation of these components.
       */}
      <Box mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
        <KpiTile
          wide
          title={text.barscale_titel}
          description={text.extra_uitleg}
        >
          <KpiValue
            absolute={data.nursing_home.last_value.newly_infected_people}
          />
        </KpiTile>
      </Box>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={data.nursing_home.values.map((value) => ({
            value: value.newly_infected_people,
            date: value.date_of_report_unix,
          }))}
        />
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
