/**
 * Font Awesome Icon Configuration
 * 
 * This file registers Font Awesome icons for use throughout the application.
 * Import icons from the appropriate package and add them to the library.
 */

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

// Solid icons
import {
  faHome,
  faNewspaper,
  faFileAlt,
  faTags,
  faPalette,
  faCog,
  faBars,
  faSearch,
  faEdit,
  faTrash,
  faEye,
  faHeart,
  faShare,
  faPlus,
  faCheck,
  faChartBar,
  faClock,
  faUser,
  faEnvelope,
  faChevronRight,
  faChevronLeft,
  faTimes,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

// Regular icons
import {
  faHeart as farHeart,
  faEye as farEye
} from '@fortawesome/free-regular-svg-icons';

// Brand icons
import {
  faTwitter,
  faFacebook,
  faLinkedin,
  faGithub,
  faDribbble
} from '@fortawesome/free-brands-svg-icons';

/**
 * Register icons with Font Awesome library
 */
export function registerFontAwesomeIcons(library: FaIconLibrary): void {
  // Solid icons
  library.addIcons(
    faHome,
    faNewspaper,
    faFileAlt,
    faTags,
    faPalette,
    faCog,
    faBars,
    faSearch,
    faEdit,
    faTrash,
    faEye,
    faHeart,
    faShare,
    faPlus,
    faCheck,
    faChartBar,
    faClock,
    faUser,
    faEnvelope,
    faChevronRight,
    faChevronLeft,
    faTimes,
    faExternalLinkAlt
  );

  // Regular icons
  library.addIcons(
    farHeart,
    farEye
  );

  // Brand icons
  library.addIcons(
    faTwitter,
    faFacebook,
    faLinkedin,
    faGithub,
    faDribbble
  );
}
