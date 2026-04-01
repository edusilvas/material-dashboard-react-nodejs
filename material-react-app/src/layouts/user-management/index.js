import { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import adminService from "services/admin.service";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error("ERRO_AO_BUSCAR_USUARIOS", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (id, currentStatus) => {
    try {
      await adminService.banUser(id, !currentStatus);
      fetchUsers();
    } catch (e) {
      alert("Falha ao alterar status de banimento.");
    }
  };

  const handleCredits = async (id) => {
    const amount = prompt("Quantidade de créditos a adicionar/remover:");
    if (amount) {
      try {
        await adminService.updateCredits(id, parseInt(amount));
        fetchUsers();
      } catch (e) {
        alert("Falha ao atualizar créditos.");
      }
    }
  };

  const columns = [
    { Header: "Usuário", accessor: "user", width: "30%", align: "left" },
    { Header: "Tipo", accessor: "type", align: "left" },
    { Header: "Onboarding", accessor: "onboarding", align: "center" },
    { Header: "Créditos", accessor: "credits", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Ações", accessor: "action", align: "center" },
  ];

  const rows = users.map((u) => ({
    user: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={u.profile_image} name={u.name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {u.name}
          </MDTypography>
          <MDTypography variant="caption">{u.email}</MDTypography>
        </MDBox>
      </MDBox>
    ),
    type: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.profileType === "USER" ? "USUÁRIO" : u.profileType}
      </MDTypography>
    ),
    onboarding: (
      <MDBox ml={-1}>
        <MDBadge 
          badgeContent={u.hasCompletedOnboarding ? "CONCLUÍDO" : "PENDENTE"} 
          color={u.hasCompletedOnboarding ? "success" : "warning"} 
          variant="gradient" 
          size="sm" 
        />
      </MDBox>
    ),
    credits: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {u.credits || 0}
      </MDTypography>
    ),
    status: (
      <MDBox ml={-1}>
        <MDBadge 
          badgeContent={u.isBanned ? "BANIDO" : "ATIVO"} 
          color={u.isBanned ? "error" : "success"} 
          variant="gradient" 
          size="sm" 
        />
      </MDBox>
    ),
    action: (
      <MDBox display="flex" gap={1}>
        <MDButton 
          variant="text" 
          color={u.isBanned ? "success" : "error"} 
          size="small"
          onClick={() => handleBan(u.id, u.isBanned)}
        >
          {u.isBanned ? "Desbanir" : "Banir"}
        </MDButton>
        <MDButton 
          variant="text" 
          color="info" 
          size="small"
          onClick={() => handleCredits(u.id)}
        >
          Créditos
        </MDButton>
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  Gestão de Usuários JobFlow
                </MDTypography>
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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default UserManagement;
