import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import siteText from '~/locale/index';
import { GenericContentHeader } from '~/components/contentHeader';
import { KpiSection } from '~/components-styled/kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { EscalationLevelInfoLabel } from '~/components/common/escalation-level';
import { Box } from '~/components-styled/base';
import { useRouter } from 'next/router';
import { ExternalLink } from '~/components-styled/external-link';
import Link from 'next/link';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { useRestrictionsTable } from '~/utils/useRestrictionsTable';
import { RestrictionsTable } from '~/components/restrictions/restrictionsTable';

const text = siteText.veiligheidsregio_maatregelen;
type VRCode = keyof typeof siteText.veiligheidsregio_maatregelen_urls;

const RegionalRestrictions: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName, escalationLevel } = props;
  const router = useRouter();
  const { code } = router.query;

  const vrcode: VRCode =
    code && !Array.isArray(code) ? (code as VRCode) : 'VR01';

  const regioUrl = siteText.veiligheidsregio_maatregelen_urls[vrcode];

  const restrictionsTable = useRestrictionsTable(data.restrictions.values);

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <GenericContentHeader
        category={siteText.veiligheidsregio_layout.headings.maatregelen}
        title={replaceVariablesInText(text.titel, {
          safetyRegionName,
        })}
      />
      <KpiSection flexDirection="column">
        <Heading level={3}>{text.titel_risiconiveau}</Heading>
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent="flex-start"
        >
          <Box
            flexShrink={0}
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            mr={5}
          >
            <EscalationLevelInfoLabel escalationLevel={escalationLevel} />
          </Box>
          <Box display="flex" flexDirection="column">
            <Text>{text.toelichting_risiconiveau}</Text>
            <Link href="/over-risiconiveaus">
              <a>{text.linktext_riskpage}</a>
            </Link>
          </Box>
        </Box>
      </KpiSection>

      <KpiSection>
        <RestrictionsTable data={restrictionsTable} />
      </KpiSection>

      <KpiSection display="flex" flexDirection={['column', 'row']}>
        <Box
          borderRight={{ lg: '1px solid lightgrey' }}
          borderBottom={{ xs: '1px solid lightgrey' }}
        >
          <Heading level={3}>{text.titel_aanvullendemaatregelen}</Heading>
          <Box>{text.toelichting_aanvullendemaatregelen}</Box>
        </Box>
        <Box ml={[0, 3]} pt={[2, 0]} flexShrink={0} display="flex">
          {regioUrl.length > 0 && (
            <>
              <ExternalLinkIcon />
              <ExternalLink
                pl={1}
                href={regioUrl}
                text={replaceVariablesInText(text.linktext_regionpage, {
                  safetyRegionName,
                })}
              />
            </>
          )}
        </Box>
      </KpiSection>
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default RegionalRestrictions;
