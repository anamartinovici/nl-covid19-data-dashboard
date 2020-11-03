import locale from '~/locale/index';
import { Box, Spacer } from './base';
import { ExternalLink } from './external-link';
import { Text, Heading } from './typography';
import { Tile } from './layout';

interface KpiTileProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  sourcedFrom?: {
    text: string;
    href: string;
  };
  wide?: boolean;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiTile({
  title,
  description,
  children,
  sourcedFrom,
  wide,
}: KpiTileProps) {
  const content = wide ? (
    <>
      <Box display={{ lg: 'flex' }}>
        <Box>
          <Heading level={3}>{title}</Heading>
          <Box mb={4}>{children}</Box>
        </Box>
        <Box>
          {description && (
            <Text
              as="div"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
        </Box>
      </Box>
    </>
  ) : (
    <>
      <Heading level={3}>{title}</Heading>
      <Box mb={4}>{children}</Box>

      {description && (
        <Text
          as="div"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
    </>
  );

  return (
    <Tile>
      {content}
      {sourcedFrom && (
        <>
          {/* Using a spacer to push the footer down */}
          <Spacer m="auto" />
          <Text as="footer" mt={3}>
            {locale.common.metadata.source}: <ExternalLink {...sourcedFrom} />
          </Text>
        </>
      )}
    </Tile>
  );
}
