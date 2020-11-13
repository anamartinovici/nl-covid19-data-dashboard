import { useRouter } from 'next/router';
import MaatregelenIcon from '~/assets/maatregelen.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading } from '~/components-styled/typography';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { GenericContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';
import { SEOHead } from '~/components/seoHead';
import { EscalationMapLegenda } from '~/pages/veiligheidsregio';
import { INationalData } from '~/static-props/nl-data';
import { useRestrictionLevel } from '~/utils/useRestrictionLevel';
import { useRestrictionsTable } from '~/utils/useRestrictionsTable';
export { getStaticProps } from '~/pages';

const NationalRestrictions: FCWithLayout<INationalData> = (props) => {
  const { data, text } = props;
  const router = useRouter();

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);
  const restrictionLevel = useRestrictionLevel(data.restrictions.values);

  if (!text) {
    return null;
  }

  const escalationLevel = restrictionLevel > 4 ? 4 : restrictionLevel;

  const key = restrictionLevel.toString() as keyof typeof text.maatregelen.headings;
  const restrictionInfo = text.maatregelen.headings[key];

  return (
    <>
      <SEOHead
        title={text.nationaal_metadata.title}
        description={text.nationaal_metadata.description}
      />
      <GenericContentHeader
        title={text.nationaal_maatregelen.titel}
        Icon={MaatregelenIcon}
      />

      <ChoroplethTile
        title={text.veiligheidsregio_index.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.veiligheidsregio_index.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda text={text} />
          </>
        }
      >
        <SafetyRegionChoropleth
          metricName="escalation_levels"
          metricValueName="escalation_level"
          onSelect={createSelectRegionHandler(router, 'maatregelen')}
          tooltipContent={escalationTooltip(router)}
        />
      </ChoroplethTile>

      <KpiSection display="flex" flexDirection="column">
        <Heading level={3}>{restrictionInfo.extratoelichting.titel}</Heading>
        <RestrictionsTable
          data={restrictionsTable}
          escalationLevel={escalationLevel}
        />
      </KpiSection>
    </>
  );
};

NationalRestrictions.getLayout = getNationalLayout();

export default NationalRestrictions;
