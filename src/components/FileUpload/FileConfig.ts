import png from '../../assets/png.png';
import jpg from '../../assets/jpg.png';
import svg from '../../assets/svg.png';
import defaultImage from '../../assets/default.png';

export const ImageConfig: {
  png: string;
  jpg: string;
  jpeg: string;
  svg: string;
  'svg+xml': string;
  default: string;
} = {
  png,
  jpg,
  jpeg: jpg,
  svg,
  'svg+xml': svg,
  default: defaultImage,
};
