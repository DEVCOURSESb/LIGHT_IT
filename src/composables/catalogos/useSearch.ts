import { ref } from "vue";

export const useSearch = () => {
  const search = ref("");

  const setSearch = (newValue: string) => {
    search.value = newValue;
  }

  return {
    search,
    setSearch
  };
};
