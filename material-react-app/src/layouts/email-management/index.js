import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import adminService from "services/admin.service";

function EmailManagement() {
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchData = async () => {
    try {
      const ts = await adminService.getEmailTemplates();
      setTemplates(ts);
      // Fetching logs if implemented in service
    } catch (e) {
      console.error("ERRO_AO_BUSCAR_EMAILS", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { Header: "Nome", accessor: "name", width: "30%", align: "left" },
    { Header: "Assunto", accessor: "subject", align: "left" },
    { Header: "Tipo", accessor: "type", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
  ];

  const rows = templates.map((t) => ({
    name: <MDTypography variant="button" fontWeight="medium">{t.name}</MDTypography>,
    subject: <MDTypography variant="caption" color="text">{t.subject}</MDTypography>,
    type: <MDTypography variant="caption" color="text">{t.type}</MDTypography>,
    status: <MDTypography variant="caption" color={t.active ? "success" : "error"}>{t.active ? "Ativo" : "Inativo"}</MDTypography>,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
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
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h6" color="white">
              Templates de E-mail Transacional
            </MDTypography>
            <MDButton variant="outlined" color="white" size="small">
              Novo Template
            </MDButton>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={true}
              entriesPerPage={true}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmailManagement;
