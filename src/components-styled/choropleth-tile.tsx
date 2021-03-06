import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { ChoroplethThresholdsValue } from '~/components/choropleth/shared';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from './base';
import {
  ChartRegionControls,
  RegionControlOption,
} from './chart-region-controls';
import { ChartTileContainer } from './chart-tile-container';
import { MetadataProps } from './metadata';
import { Heading, Text } from './typography';

/**
 * We could use strong typing here for the values and also enforce the data
 * prop to be set. Might be a good idea.
 *
 * @TODO move to a shared location
 */
interface DataProps {
  'data-cy'?: string;
}

interface ChoroplethTileProps extends DataProps {
  title: string;
  description?: string | React.ReactNode;
  onChangeControls?: (v: RegionControlOption) => void;
  children: React.ReactNode;
  legend?: {
    title: string;
    thresholds: ChoroplethThresholdsValue[];
  };
  metadata?: MetadataProps;
  showDataWarning?: boolean;
}

export function ChoroplethTile<T>({
  title,
  description,
  onChangeControls,
  legend,
  children,
  metadata,
  showDataWarning,
}: ChoroplethTileProps) {
  const breakpoints = useBreakpoints();
  const legendaComponent = legend && (
    <ChoroplethLegenda thresholds={legend.thresholds} title={legend.title} />
  );

  return (
    <ChartTileContainer metadata={metadata} showDataWarning={showDataWarning}>
      <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
        <Box mb={3} flex={{ lg: 1 }}>
          <Box mb={[0, 2]}>
            <Heading level={3}>{title}</Heading>
            {typeof description === 'string' ? (
              <Text>{description}</Text>
            ) : (
              description
            )}
            {onChangeControls && (
              <Box
                display="flex"
                justifyContent={{ _: 'center', lg: 'flex-start' }}
              >
                <ChartRegionControls onChange={onChangeControls} />
              </Box>
            )}
          </Box>

          {legendaComponent && breakpoints.lg && (
            <Box display="flex" flexDirection="row" alignItems="flex-center">
              {legendaComponent}
            </Box>
          )}
        </Box>

        <Box flex={{ lg: 1 }} ml={[0, 0, 3]}>
          <div>{children}</div>

          {legendaComponent && !breakpoints.lg && (
            <Box display="flex" justifyContent="center">
              {legendaComponent}
            </Box>
          )}
        </Box>
      </Box>
    </ChartTileContainer>
  );
}
