import useSettingsStore from "@/store/settings";

const useView = () => {
  const view = useSettingsStore((state) => state.selectedOptions.view);

  return view;
};

export default useView;