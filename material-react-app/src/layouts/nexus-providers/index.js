import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import adminService from "services/admin.service";

function NexusProviders() {
  const [providers, setProviders] = useState([]);
  const [balances, setBalances] = useState([]);

  const fetchData = async () => {
    try {
      const [provs, bals] = await Promise.all([
        adminService.getProviders(),
        adminService.getBalances()
      ]);
      setProviders(provs);
      setBalances(bals);
    } catch (e) {
      console.error("ERRO_AO_BUSCAR_PROVEDORES", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      await adminService.toggleProvider(id, !currentStatus);
      fetchData();
    } catch (e) {
      alert("Erro ao alterar estado do provedor.");
    }
  };

  const columns = [
    { Header: "Provedor", accessor: "name", width: "40%", align: "left" },
    { Header: "Adapter", accessor: "adapter", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Ação", accessor: "action", align: "center" },
  ];

  const rows = providers.map((p) => ({
    name: (
      <MDTypography variant="button" fontWeight="medium">
        {p.name || p.adapterClass}
      </MDTypography>
    ),
    adapter: (
      <MDTypography variant="caption" color="text">
        {p.adapterClass}
      </MDTypography>
    ),
    status: (
      <MDBadge 
        badgeContent={p.active ? "ATIVO" : "INATIVO"} 
        color={p.active ? "success" : "error"} 
        variant="gradient" 
        size="sm" 
      />
    ),
    action: (
      <MDButton 
        variant="text" 
        color={p.active ? "error" : "success"} 
        onClick={() => handleToggle(p._id, p.active)}
      >
        {p.active ? "Desativar" : "Ativar"}
      </MDButton>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {balances.map((b) => (
              <Grid item xs={12} md={6} lg={4} key={b.provider}>
                <Card>
                  <MDBox p={2} display="flex" justifyContent="space-between">
                    <MDBox>
                      <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                        Créditos {b.provider}
                      </MDTypography>
                      <MDTypography variant="h4" fontWeight="bold">
                        {b.credits}
                      </MDTypography>
                    </MDBox>
                    <MDBox variant="gradient" bgColor="info" color="white" borderRadius="md" p={1} display="flex" alignItems="center">
                      <Icon fontSize="medium">account_balance_wallet</Icon>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Nexus Engine Providers
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NexusProviders;
