// src/styles/commonStyles.js
import { css } from "styled-components";

export const responsiveScheduleLayout = css`
  @media (max-width: 1100px) {
    .schedule-grid {
      display: grid !important;
      grid-template-columns: 1fr !important; /* ✅ 강제 1열 */
    }
    .details {
      align-items: stretch !important;
      padding-right: clamp(20px, 5vw, 80px) !important;
    }
    .details-img {
      max-width: none !important;
      aspect-ratio: 3 / 2 !important;
    }
  }
`;