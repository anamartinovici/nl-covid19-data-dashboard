import { colors } from '~/style/theme';
import { ChoroplethThresholdsValue } from './shared';

const positiveTestedThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 4,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 7,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 10,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 20,
  },
  {
    color: colors.data.scale.blue[5],
    threshold: 30,
  },
];

const hospitalAdmissionsThresholds: ChoroplethThresholdsValue[] = [
  {
    color: colors.data.scale.blue[0],
    threshold: 0,
  },
  {
    color: colors.data.scale.blue[1],
    threshold: 3,
  },
  {
    color: colors.data.scale.blue[2],
    threshold: 6,
  },
  {
    color: colors.data.scale.blue[3],
    threshold: 9,
  },
  {
    color: colors.data.scale.blue[4],
    threshold: 15,
  },
];

export const municipalThresholds = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
} as const;
