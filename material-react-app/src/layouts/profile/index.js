/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "context";
import AuthService from "services/auth-service";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/profile/components/Header";

function Overview() {
  const { setCompletedOnboarding } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        const user = response.data.attributes;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          description: user.description || "Olá, estou usando o JobFlow!",
        });
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSync = async () => {
    try {
      const payload = {
        data: {
          type: "users",
          attributes: {
            name: formData.name,
            email: formData.email,
            description: formData.description,
          }
        }
      };
      await AuthService.updateProfile(payload);
      setCompletedOnboarding(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
      alert("Erro ao sincronizar dados. Tente novamente.");
    }
  };

  if (loading) return <MDBox p={3}><MDTypography>Carregando...</MDTypography></MDBox>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3} px={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, mb: 3 }}>
                <MDTypography variant="h6" fontWeight="medium" mb={3}>
                  Sincronização de Perfil (Onboarding)
                </MDTypography>
                
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDTypography variant="caption" fontWeight="bold">Nome Completo</MDTypography>
                    <MDInput 
                      type="text" 
                      name="name"
                      value={formData.name} 
                      onChange={handleInputChange}
                      fullWidth 
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDTypography variant="caption" fontWeight="bold">E-mail</MDTypography>
                    <MDInput 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      disabled
                      fullWidth 
                    />
                  </MDBox>
                  <MDBox mb={3}>
                    <MDTypography variant="caption" fontWeight="bold">Sobre você / Bio</MDTypography>
                    <MDInput 
                      type="text" 
                      name="description"
                      value={formData.description} 
                      onChange={handleInputChange}
                      multiline 
                      rows={4} 
                      fullWidth 
                    />
                  </MDBox>
                  
                  <MDBox mt={4} mb={1}>
                    <MDButton 
                      variant="gradient" 
                      color="info" 
                      fullWidth 
                      size="large"
                      onClick={handleSync}
                    >
                      Salvar e Sincronizar Dados
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
