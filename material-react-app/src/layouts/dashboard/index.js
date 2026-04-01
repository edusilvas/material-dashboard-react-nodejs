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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useState, useEffect } from "react";
import kpiService from "services/kpi.service";

function Dashboard() {
  const [stats, setStats] = useState({
    mrr: "0.00",
    revenueGrowth: "+0%",
    totalUsers: 0,
    regFunnel: { rate: 0, completed: 0 },
    payFunnel: { conversionRate: 0, intents: 0 },
    roi: { costPerApplication: 0, totalApplied: 0 }
  });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [revenue, reg, pay, roi] = await Promise.all([
          kpiService.getRevenueMRR(),
          kpiService.getRegistrationFunnel(),
          kpiService.getPaymentFunnel(),
          kpiService.getCreditROI()
        ]);
        
        setStats({
          mrr: revenue.mrr,
          totalUsers: revenue.totalUsers,
          regFunnel: reg,
          payFunnel: pay,
          roi: roi,
          revenueGrowth: "+5%" // Placeholder for growth calculation
        });
      } catch (e) {
        console.error("FALHA_AO_CARREGAR_KPIS", e);
      }
    };
    fetchKPIs();
  }, []);

  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Total de Usuários"
                count={stats.totalUsers}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Base JobFlow Atlas",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Conversão Cadastro"
                count={`${stats.regFunnel.rate}%`}
                percentage={{
                  color: "success",
                  amount: stats.regFunnel.completed,
                  label: "Perfis completos",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="payments"
                title="Receita (MRR)"
                count={`R$ ${stats.mrr}`}
                percentage={{
                  color: "success",
                  amount: stats.revenueGrowth,
                  label: "vs mês anterior",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="analytics"
                title="ROI (Custo/App)"
                count={`$${stats.roi.costPerApplication}`}
                percentage={{
                  color: "success",
                  amount: stats.roi.totalApplied,
                  label: "Candidaturas totais",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
