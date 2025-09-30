import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css';

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  padding: '20px',
});

export const modal = style({
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'hidden',
  boxShadow: theme.shadow.xl,
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  padding: '20px 24px',
  borderBottom: `1px solid ${theme.color.gray[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.color.primary[50],
  
  '> h2': {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.color.primary[700],
  },
});

export const closeButton = style({
  background: 'none',
  border: 'none',
  padding: '8px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.color.gray[500],
  
  ':hover': {
    backgroundColor: theme.color.gray[100],
    color: theme.color.gray[700],
  },
});

export const loading = style({
  padding: '40px',
  textAlign: 'center',
  color: theme.color.gray[600],
});

export const content = style({
  flex: 1,
  overflowY: 'auto',
  padding: '0 24px 24px 24px',
});

export const section = style({
  marginBottom: '24px',
  
  '> h3': {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: theme.color.gray[800],
  },
});

export const basicInfo = style({
  '> p': {
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: theme.color.gray[700],
  },
});

export const rating = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
  
  '> span:first-of-type': {
    fontSize: '18px',
    fontWeight: 'bold',
    color: theme.color.gray[800],
  },
  
  color: theme.color.warning[500],
});

export const reviewCount = style({
  color: `${theme.color.gray[500]} !important`,
  fontSize: '14px',
});

export const address = style({
  fontSize: '14px',
});

export const phone = style({
  fontSize: '14px',
});

export const author = style({
  fontSize: '12px',
  color: theme.color.gray[500],
  marginTop: '8px',
});

export const price = style({
  fontSize: '16px',
  fontWeight: '500',
  color: theme.color.primary[600],
  margin: 0,
});

export const topokkiInfo = style({
  display: 'grid',
  gap: '16px',
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const tag = style({
  backgroundColor: theme.color.primary[100],
  color: theme.color.primary[700],
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const spicyLevel = style({
  fontSize: '12px',
});

export const sideMenus = style({
  display: 'grid',
  gap: '8px',
});

export const sideMenu = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  backgroundColor: theme.color.gray[50],
  borderRadius: '8px',
  fontSize: '14px',
});

export const sideMenuPrice = style({
  color: theme.color.primary[600],
  fontWeight: '500',
});

export const reviewHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

export const writeReviewButton = style({
  backgroundColor: theme.color.primary[500],
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  
  ':hover': {
    backgroundColor: theme.color.primary[600],
  },
});

export const reviews = style({
  display: 'grid',
  gap: '16px',
});

export const review = style({
  padding: '16px',
  backgroundColor: theme.color.gray[50],
  borderRadius: '8px',
  border: `1px solid ${theme.color.gray[200]}`,
});

export const reviewMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const reviewAuthor = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.color.gray[700],
});

export const avatar = style({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const avatarPlaceholder = style({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: theme.color.primary[500],
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
});

export const reviewRating = style({
  color: theme.color.warning[500],
  fontSize: '14px',
});

export const reviewDate = style({
  fontSize: '12px',
  color: theme.color.gray[500],
});

export const reviewContent = style({
  margin: '12px 0 0 0',
  fontSize: '14px',
  lineHeight: '1.5',
  color: theme.color.gray[700],
});

export const noReviews = style({
  textAlign: 'center',
  color: theme.color.gray[500],
  fontSize: '14px',
  padding: '20px',
  margin: 0,
});