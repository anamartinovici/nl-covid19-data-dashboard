import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { ComboBox } from '~/components/comboBox';
import { IntakeHospitalMetric } from '~/components/gemeente/intake-hospital-metric';
import { PositivelyTestedPeopleMetric } from '~/components/gemeente/positively-tested-people-metric';
import { SewerWaterMetric } from '~/components/gemeente/sewer-water-metric';
import { getLayout as getSiteLayout } from '~/components/layout';
import municipalities from '~/data/gemeente_veiligheidsregio.json';
import siteText from '~/locale/index';
import { IMunicipalityData } from '~/static-props/municipality-data';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { getSewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';
import { useMediaQuery } from '~/utils/useMediaQuery';

interface IMunicipality {
  name: string;
  safetyRegion: string;
  gemcode: string;
}

/**
 * When you navigate to /gemeente root from the top menu, there is no GM code
 * and the data will be undefined. That's why we use Partial here, so that TS
 * knows that data and other props from data are not guaranteed to be present.
 */
interface MunicipalityLayoutProps extends Partial<IMunicipalityData> {
  children: React.ReactNode;
}

export function getMunicipalityLayout() {
  return function (
    page: React.ReactNode,
    pageProps: IMunicipalityData & {
      lastGenerated: string;
    }
  ): React.ReactNode {
    const lastGenerated = pageProps.lastGenerated;
    return getSiteLayout(
      siteText.gemeente_metadata,
      lastGenerated
    )(<MunicipalityLayout {...pageProps}>{page}</MunicipalityLayout>);
  };
}

/**
 * MunicipalityLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /gemeente -> only show aside
 * - /gemeente/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /gemeente -> shows aside and content (children)
 * - /gemeente/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function MunicipalityLayout(props: MunicipalityLayoutProps) {
  const { children, data, municipalityName } = props;
  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const { code } = router.query;

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;

  const isMenuOpen = router.query.menu === '1';
  const menuOpenUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleMunicipalitySelect(region: IMunicipality) {
    if (isLargeScreen) {
      router.push(`/gemeente/${region.gemcode}/positief-geteste-mensen`);
    } else {
      router.push(`/gemeente/${region.gemcode}`);
    }
  }

  const safetyRegion:
    | { name: string; code: string; id: number }
    | undefined = getSafetyRegionForMunicipalityCode(code as string);

  const sewerWaterBarScaleData = data && getSewerWaterBarScaleData(data);

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>
      <div
        className={`municipality-layout ${
          isMainRoute
            ? 'has-menu-and-content-opened'
            : isMenuOpen
            ? 'has-menu-opened'
            : 'has-menu-closed'
        }`}
      >
        <Link href={menuOpenUrl}>
          <a className="back-button">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="municipality-aside">
          <ComboBox<IMunicipality>
            placeholder={siteText.common.zoekveld_placeholder_gemeente}
            onSelect={handleMunicipalitySelect}
            options={municipalities}
          />

          {showMetricLinks && (
            <nav
              /** re-mount when route changes in order to blur anchors */
              key={router.asPath}
              aria-label="metric navigation"
            >
              <div className="region-names">
                <h2>{municipalityName}</h2>
                {safetyRegion && (
                  <p>
                    {siteText.common.veiligheidsregio_label}{' '}
                    <Link
                      href={`/veiligheidsregio/${safetyRegion.code}/positief-geteste-mensen`}
                    >
                      <a>{safetyRegion.name}</a>
                    </Link>
                  </p>
                )}
              </div>
              {data && (
                <>
                  <h2>{siteText.gemeente_layout.headings.besmettingen}</h2>
                  <ul>
                    <li>
                      <Link href={`/gemeente/${code}/positief-geteste-mensen`}>
                        <a
                          className={getClassName(
                            `/gemeente/[code]/positief-geteste-mensen`
                          )}
                        >
                          <HeadingWithIcon
                            icon={<GetestIcon />}
                            title={
                              siteText.gemeente_positief_geteste_personen
                                .titel_sidebar
                            }
                          />
                          <span className="metric-wrapper">
                            <PositivelyTestedPeopleMetric data={data} />
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>

                  <h2>{siteText.gemeente_layout.headings.ziekenhuizen}</h2>
                  <ul>
                    <li>
                      <Link href={`/gemeente/${code}/ziekenhuis-opnames`}>
                        <a
                          className={getClassName(
                            `/gemeente/[code]/ziekenhuis-opnames`
                          )}
                        >
                          <HeadingWithIcon
                            icon={<Ziekenhuis />}
                            title={
                              siteText.gemeente_ziekenhuisopnames_per_dag
                                .titel_sidebar
                            }
                          />
                          <span className="metric-wrapper">
                            <IntakeHospitalMetric data={data} />
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </>
              )}

              <h2>{siteText.gemeente_layout.headings.vroege_signalen}</h2>
              <ul>
                <li>
                  {sewerWaterBarScaleData ? (
                    <Link href={`/gemeente/${code}/rioolwater`}>
                      <a
                        className={getClassName(`/gemeente/[code]/rioolwater`)}
                      >
                        <HeadingWithIcon
                          icon={<RioolwaterMonitoring />}
                          title={
                            siteText.gemeente_rioolwater_metingen.titel_sidebar
                          }
                        />
                        <span className="metric-wrapper">
                          <SewerWaterMetric data={sewerWaterBarScaleData} />
                        </span>
                      </a>
                    </Link>
                  ) : (
                    <div className="metric-not-available">
                      <HeadingWithIcon
                        icon={<RioolwaterMonitoring />}
                        title={
                          siteText.gemeente_rioolwater_metingen.titel_sidebar
                        }
                      />
                      <p>
                        {siteText.gemeente_rioolwater_metingen.nodata_sidebar}
                      </p>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </aside>

        <section className="municipality-content">{children}</section>

        <Link href={menuOpenUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
