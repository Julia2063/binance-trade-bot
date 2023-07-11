import BuyCrypto from "./BuyCrypto";
import BuyCryptoConfirm from "./BuyCryptoConfirm";
import BuyCryptoDetails from "./BuyCryptoDetails";
import Markets from "./Markets";
import SellSelect from "./SellSelect";
import SellCryptoAmount from "./SellCryptoAmount";
import SellCryptoConfirm from "./SellCryptoConfirm";
import SellCryptoDetails from "./SellCryptoDetails";
import Blog from "./Blog";
import BlogGrid01 from "./BlogGrid01";
import BlogDetails from "./BlogDetails";
import Wallet from "./Wallet";
import UserProfile from "./UserProfile";
import Login from "./Login";
import Register from "./Register";
import Contact from "./Contact";
import Faq from "./Faq";
import PrivacyPolicy from "./PrivacyPolicy";
import Certificates from "./Certificates";
import WorkPage from "./WorkPage";
import HomePage from "./HomePage";
import TermsConditions from "./TermsConditions";

const routes = [
  { path: '/', component: <HomePage />},
  { path: '/buy-crypto-select', component: <BuyCrypto />},
  { path: '/buy-crypto-confirm', component: <BuyCryptoConfirm />},
  { path: '/buy-crypto-details', component: <BuyCryptoDetails />},
  { path: '/markets', component: <Markets />},
  { path: '/sell-select', component: <SellSelect />},
  { path: '/sell-crypto-amount', component: <SellCryptoAmount />},
  { path: '/sell-crypto-confirm', component: <SellCryptoConfirm />},
  { path: '/sell-crypto-details', component: <SellCryptoDetails />},
  { path: '/blog-default', component: <Blog />},
  { path: '/blog-grid-v1', component: <BlogGrid01 />},
 
 
  { path: '/blog-details', component: <BlogDetails />},
  { path: '/wallet', component: <Wallet />},
  { path: '/user-profile', component: <UserProfile />},
  { path: '/login', component: <Login />},
  { path: '/register', component: <Register />},
  { path: '/contact', component: <Contact />},
  { path: '/faq', component: <Faq />},
  { path: '/privacy', component: <PrivacyPolicy />},
  { path: '/certificates', component: <Certificates />},
  { path: '/work-page', component: <WorkPage />},
  { path: '/terms-and-conditions', component: <TermsConditions />},
  { path: '/privacy-policy', component: <PrivacyPolicy />},
]

export default routes;
