import { Outlet } from "react-router-dom";
import Layout from "./layout";

const AppLayout = () => {
  return (
    <Layout>
      <Outlet /> {/* This is where HomePage or TasksPage will render */}
    </Layout>
  );
};

export default AppLayout;