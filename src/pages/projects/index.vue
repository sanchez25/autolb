<template>
  <ProjectsTable :owners="owner.data" />
</template>

<script>
import ProjectsTable from "../../components/Projects/ProjectsTable";
export default {
  name: "ProjectsPage",
  layout: "dashboard",
  components: {
    ProjectsTable,
  },
  async asyncData({ $axios }) {
    const owner_response = await $axios.post("/frontend/api/user/filter", {
      headers: {
        "content-type": "application/json",
      },
    });
    const owner = owner_response.data;
    return { owner };
  },
};
</script>

<style scoped>
</style>
