<template>
  <PackageTable :sources="source.data" />
</template>

<script>
import PackageTable from "../../components/Package/PackageTable";
export default {
  name: "PackagePage",
  layout: "dashboard",
  components: {
    PackageTable,
  },
  async asyncData({ $axios }) {
    const source_response = await $axios.post(
      "/frontend/api/profile/filter_sources",
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const source = source_response.data;
    return { source };
  },
};
</script>

<style scoped>
</style>