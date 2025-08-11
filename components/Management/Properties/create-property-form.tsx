"use client";

// Types
import type {
  CreatePropertyFormProps,
  PropertyFormStateType,
  AllBranchesResponse,
  AllLandlordsResponse,
  AllInventoryResponse,
} from "./types";
import { convertYesNoToBoolean } from "@/utils/checkFormDataForImageOrAvatar";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PlusIcon, DeleteIconX, ExclamationMark } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import {
  getAllCities,
  getAllLocalGovernments,
  getAllStates,
  getCities,
  getLocalGovernments,
} from "@/utils/states";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableImage from "./draggable-image";
import { propertyCategories } from "@/data";
import { AuthForm } from "@/components/Auth/auth-components";
import {
  getAllStaffByBranch,
  property_form_state_data,
  transformPropertyFormData,
} from "./data";
import { currencySymbols } from "@/utils/number-formatter";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import PropertyFormFooter from "./property-form-footer.tsx";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useFetch from "@/hooks/useFetch";
import clsx from "clsx";
import { useAddUnitStore } from "@/store/add-unit-store";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import GoogleMapsModal from "./google-maps";
import { MultiSelect } from "@/components/multiselect/multi-select";
import { Cat } from "lucide-react";
import SelectWithImage from "@/components/Form/Select/select-with-image";
import RestrictInput from "@/components/Form/Input/InputWIthRestrict";
import {
  fetchBranchDependentData,
  getBranchInventories,
} from "@/utils/getData";
import { BranchDependentData } from "@/utils/types";
import api, { handleAxiosError } from "@/services/api";
import FullPageLoader from "@/components/Loader/start-rent-loader";
import { useTourStore } from "@/store/tour-store";
import { usePathname } from "next/navigation";
import { useGlobalStore } from "@/store/general-store";
import { toast } from "sonner";
import { landlordTableFields } from "@/app/(nav)/manager/management/landlord/data";
import { useBranchInfoStore } from "@/store/branch-info-store";

const maxNumberOfImages = 6;

type SetPropertyStateChanges = Partial<{
  [K in keyof PropertyFormStateType]: PropertyFormStateType[K];
}>;

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  editMode,
  handleSubmit,
  formType,
  propertyId,
  onAddUnit,
  landlordId,
}) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const selectedLandlordId = useGlobalStore((s) => s.selectedLandlordId);
  const { branch } = usePersonalInfoStore();
  const branchIdFromStore = useBranchInfoStore((state) => state.branch_id);
  const [state, setState] = useState<PropertyFormStateType>(
    property_form_state_data
  );
  const { role, setRole } = useRole();
  const {
    goToStep,
    restartTour,
    isTourCompleted,
    persist,
    setShouldRenderTour,
    setPersist,
  } = useTourStore();
  const pathname = usePathname();
  const isDirector = role === "director";
  const isAccountOfficer = role === "account";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>(() => {
    return editMode && propertyDetails?.staff_id
      ? propertyDetails.staff_id
      : [];
  });

  // const [selectedLandlord, setSelectedLandlord] = useState<string[]>([]);
  const [selectedLandlord, setSelectedLandlord] = useState<string | undefined>(
    undefined
  );
  const [selectedOfficer, setSelectedOfficer] = useState<string[]>([]);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [branchData, setBranchData] = useState<BranchDependentData>({
    inventory: { data: null, loading: false, error: null },
    staff: { data: null, loading: false, error: null },
    accountOfficer: { data: null, loading: false, error: null },
  });
  const [inventoryData, setInventoryData] =
    useState<AllInventoryResponse | null>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [coordinate, setCoordinate] = useState(
    propertySettings?.coordinate || ""
  );

  const BRANCH_MANAGER_ID = useBranchInfoStore((state) => state.manager.id);

  const CautionDepositOptions = [
    { label: "Keep with Landlord", value: "Landlord" },
    { label: "Keep it with Manager", value: "Company" },
    { label: "Escrow it", value: "Admin" },
    { label: "None", value: "" },
  ];

  const {
    state: selectedState,
    lga,
    city,
    selectedBranch,
    staff,
    staffOptions,
    accountOfficerOptions,
    resetKey,
  } = state;

  const isFacility = formType === "facility";
  
  // const selectedBranchId = selectedBranch.value || propertyDetails?.branch_id;
  // const selectedBranchId = selectedBranch.value;
  // Use branch_id from store for non-directors, otherwise use selectedBranch.value
  const selectedBranchId = isDirector
    ? selectedBranch.value
    : branchIdFromStore;

  const setPropertyState = (changes: SetPropertyStateChanges) => {
    setState((x) => {
      const newState = { ...x, ...changes };
      if ("state" in changes) {
        newState.lga = "";
        newState.city = "";
      } else if ("lga" in changes) {
        newState.city = "";
      }
      return newState;
    });
  };

  const {
    images,
    imageFiles,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleImageReorder,
    resetImages,
  } = useMultipleImageUpload({
    maxImages: maxNumberOfImages,
    initialImages: editMode
      ? propertyDetails?.images.map((img) => img.path)
      : [],
  });

  const sortableImages = images.map((image, index) => ({
    id: uuidv4(),
    index,
    image,
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    handleImageReorder(source.index, destination.index);
  };

  // Function to reset the state
  const handleReset = () => {
    setState((x) => ({
      ...x,
      resetKey: x.resetKey + 1,
      state: editMode ? propertyDetails?.state || "" : "",
      lga: editMode ? propertyDetails?.local_govt || "" : "",
      city: editMode ? propertyDetails?.city || "" : "",
      staff: [],
    }));
    resetImages();
    setSelectedCategory(null);
    // setSelectedLandlord([]);
    // setSelectedLandlord("");
    // setGlobalStore("selectedLandlordId", "");
  };

  const {
    data: branchesData,
    loading: branchesLoading,
    error: branchesError,
  } = useFetch<AllBranchesResponse>("/branches/select");

  const {
    data: landlordsData,
    loading: landlordsLoading,
    error: landlordsError,
  } = useFetch<AllLandlordsResponse>("/landlord/select");

  const {
    data: staffsData,
    loading: staffsLoading,
    error: staffsError,
  } = useFetch<AllLandlordsResponse>(`branch/${selectedBranchId}/staff`);

  const branchOptions =
    branchesData?.data.map((branch) => ({
      value: branch.id,
      label: branch.branch_name,
    })) || [];

  useEffect(() => {
    const fetchInventory = async () => {
      if (selectedBranchId) {
        setInventoryLoading(true);
        setInventoryError(null);
        try {
          const data = await getBranchInventories(String(selectedBranchId));
          setInventoryData(data);
        } catch (error) {
          setInventoryError("Failed to load inventories");
        } finally {
          setInventoryLoading(false);
        }
      }
    };
    fetchInventory();
  }, [selectedBranchId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBranchId) {
        setBranchData({
          inventory: { data: null, loading: false, error: null },
          staff: { data: null, loading: false, error: null },
          accountOfficer: { data: null, loading: false, error: null },
        });
        return;
      }

      const data = await fetchBranchDependentData(String(selectedBranchId));
      setBranchData(data);
    };

    fetchData();
  }, [selectedBranchId]);

  useEffect(() => {
    if (branchData?.staff?.data) {
      setPropertyState({
        staffOptions: branchData?.staff?.data?.data?.map((s: any) => ({
          value: s.id,
          label: s.user.name,
          icon: s.user.profile.picture,
        })),
      });
    }
  }, [branchData?.staff?.data]);

  const landlordOptions = useMemo(
    () =>
      landlordsData?.data?.map((landlord) => ({
        value: String(landlord.id),
        label: landlord.name,
        icon: landlord.picture,
      })) || [],
    [landlordsData]
  );

  // console.log("landlordsData", landlordsData);
  const inventoryOptions =
    branchData?.inventory?.data?.data?.map((inventory: any) => ({
      value: inventory.id,
      label: inventory.title,
    })) || [];

  // const officerOptions =
  //   branchData?.accountOfficer?.data?.data?.map((officer: any) => ({
  //     value: officer.id,
  //     label: officer.user.name,
  //     icon: officer.user.profile.picture,
  //   })) || [];

  const officerOptions = useMemo(
    () =>
      branchData?.accountOfficer?.data?.data?.map((officer: any) => ({
        value: officer.id,
        label: officer.user.name,
        icon: officer.user.profile.picture,
      })) || [],
    [branchData?.accountOfficer?.data]
  );


  const staffOption = useMemo(
    () =>
      branchData?.staff?.data?.data
        ?.filter((s: any) => s.staff_role !== "manager")
        .map((s: any) => ({
          value: s.id,
          label: s.user.name,
          icon: s.user.profile.picture,
        })) || [],
    [branchData?.staff?.data]
  );

  //Stabilize the selectedStaffs initialization to prevent rerendering
  const initialSelectedStaffs = useMemo(() => {
    return editMode && propertyDetails?.staff_id
      ? propertyDetails.staff_id
      : [];
  }, [editMode, propertyDetails?.staff_id]);

  // Use useCallback to stabilize the onValueChange handler
  const handleStaffChange = useCallback((newStaffs: string[]) => {
    setSelectedStaffs(newStaffs);
  }, []);

  useEffect(() => {
    if (editMode && propertyDetails?.staff_id && selectedStaffs.length === 0) {
      setSelectedStaffs(propertyDetails.staff_id);
    }
  }, [editMode, propertyDetails?.staff_id, selectedStaffs.length]);

  // Memoize the account officer defaultValue to prevent recalculation
  const accountOfficerDefaultValue = useMemo(() => {
    if (editMode && (propertyDetails?.officer_id ?? [])[0]) {
      return (
        officerOptions.find(
          (staff: any) =>
            String(staff.value) ===
            String((propertyDetails?.officer_id ?? [])[0])
        ) || { value: "", label: "", icon: "" }
      );
    }
    return undefined;
  }, [editMode, propertyDetails?.officer_id, officerOptions]);

  useEffect(() => {
    if (staffsData) {
      setPropertyState({
        staffOptions: staffsData?.data?.map((s: any) => ({
          value: s.id,
          label: s.user.name,
          icon: s.user.profile.picture,
        })),
      });
    }
  }, [staffsData]);

  useEffect(() => {
    let newLandlord: string | undefined = undefined;
    if (
      editMode &&
      propertyDetails?.land_lord_id != null &&
      landlordOptions.length
    ) {
      newLandlord = String(propertyDetails.land_lord_id);
    } else if (!editMode && landlordId && landlordOptions.length) {
      const exists = landlordOptions.some(
        (l) => l.value === String(landlordId)
      );
      newLandlord = exists ? String(landlordId) : undefined;
    }
    setSelectedLandlord(newLandlord);
  }, [editMode, propertyDetails, landlordId, landlordOptions]);

  useEffect(() => {
    if (editMode && propertyDetails) {
      setState((x) => ({
        ...x,
        state: propertyDetails.state || "",
        lga: propertyDetails.local_govt || "",
        city: propertyDetails.city || "",
        selectedBranch: {
          value: propertyDetails.branch_id || "",
          label: propertyDetails.branch_name || "",
        },
      }));
    }
  }, [propertyDetails, editMode]);

  const yesNoFields = [
    "group_chat",
    "rent_penalty",
    "fee_penalty",
    "request_call_back",
    "book_visitors",
    "vehicle_record",
    "active_vat",
    "is_inventory",
  ];

  // console.log("selected", selectedStaffs)
  const handleFormSubmit = async (data: Record<string, any>) => {
    setRequestLoading(true);
    convertYesNoToBoolean(data, yesNoFields);
    const payload = transformPropertyFormData(
      data,
      imageFiles,
      companyId,
      selectedStaffs
    );
    await handleSubmit(payload);
    setRequestLoading(false);
  };

  const handleGoToTourStep = (stepIndex: number) => {
    goToStep(stepIndex, pathname);
  };

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("EditPropertyTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const selectedLandlordAgent = useMemo(() => {
    if (!selectedLandlord || !landlordsData?.data) return null;
    const landlord = landlordsData.data.find(
      (l) => String(l.id) === String(selectedLandlord)
    );
    return landlord?.agent || null;
  }, [selectedLandlord, landlordsData]);

  const filteredCautionDepositOptions = useMemo(() => {
    // Only show "Keep with Landlord" if agent is "Mobile"
    if (selectedLandlordAgent?.toLowerCase() === "mobile") {
      return CautionDepositOptions;
    }
    // Otherwise, filter out "Keep with Landlord"
    return CautionDepositOptions.filter((opt) => opt.value !== "Landlord");
  }, [selectedLandlordAgent]);

  if (requestLoading) {
    return <FullPageLoader text="Submitting..." />;
  }

  const handleSectionTour = () => {
    if (formType === "rental" && editMode && pathname.startsWith("/manager")) {
      handleGoToTourStep(12);
    } else if (
      formType === "rental" &&
      !editMode &&
      pathname.startsWith("/manager")
    ) {
      handleGoToTourStep(13);
    } else if (
      formType === "rental" &&
      editMode &&
      pathname.startsWith("/accountant")
    ) {
      handleGoToTourStep(11);
    } else if (
      formType === "facility" &&
      !editMode &&
      pathname.startsWith("/accountant")
    ) {
      handleGoToTourStep(9);
    } else if (formType === "rental" && !editMode) {
      handleGoToTourStep(14);
    } else if (formType === "facility" && !editMode) {
      handleGoToTourStep(11);
    } else if (formType === "rental" && editMode) {
      handleGoToTourStep(13);
    } else if (
      formType === "facility" &&
      editMode &&
      pathname.startsWith("/manager")
    ) {
      handleGoToTourStep(9);
    } else if (formType === "facility" && editMode) {
      handleGoToTourStep(10);
    }
  };

  return (
    <FlowProgress
      key="property-form-progress"
      steps={1}
      activeStep={0}
      inputClassName="property-form-input"
      showProgressBar={false}
      className={clsx({
        "p-6 bg-white dark:bg-darkText-primary rounded-2xl": editMode,
      })}
    >
      <AuthForm
        onFormSubmit={handleFormSubmit}
        // id={editMode ? "edit-property-form" : "create-property-form"}
        skipValidation
      >
        <div className="max-w-[970px] scroll-mt-[160px]" ref={scrollTargetRef}>
          <input name="property_type" type="hidden" value={formType} />
          <div className="mb-5 lg:mb-8 property-picture-upload-wrapper">
            <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
              Set{" "}
              {formType === "rental"
                ? "property"
                : selectedCategory?.toLocaleLowerCase() === "estate"
                ? "Estate"
                : selectedCategory?.toLocaleLowerCase() === "facility"
                ? "Facility"
                : "Estate/Facility"}{" "}
              pictures for easy recognition (maximum of {maxNumberOfImages}{" "}
              images). Please drag your preferred image and place it in the
              first position to make it the primary display.
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="property-images" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-4 overflow-x-auto custom-round-scrollbar overflow-y-hidden pb-2"
                  >
                    {sortableImages.map((s) => (
                      <DraggableImage
                        key={s.id}
                        id={s.id}
                        image={s.image}
                        index={s.index}
                        removeImage={removeImage}
                      />
                    ))}
                    {provided.placeholder}
                    {images.length < 6 && (
                      <label
                        htmlFor="property_pictures"
                        className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-2"
                      >
                        <PlusIcon />
                        <span className="text-black dark:text-white text-base font-normal mt-2">
                          Add Pictures
                        </span>
                        <input
                          id="property_pictures"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          ref={fileInputRef}
                        />
                      </label>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          {/* Video Link */}
          {formType === "rental" && (
            <div className="youtube-video-link-wrapper md:grid md:gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Input
                id="video_link"
                label="Video Link"
                type="url"
                className="mb-5"
                placeholder="https://www.youtube.com/video "
                inputClassName="bg-white rounded-[8px] md:col-span-1"
                defaultValue={
                  editMode ? propertyDetails?.video_link : undefined
                }
              />
            </div>
          )}
          {/* Property Details */}
          <div className="flex gap-2 items-center">
            <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
              {formType === "rental"
                ? "Property Details"
                : selectedCategory?.toLocaleLowerCase() === "estate"
                ? "Estate Details"
                : selectedCategory?.toLocaleLowerCase() === "facility"
                ? "Facility Details"
                : "Estate/Facility Details"}
            </p>
            <button
              onClick={() => {
                if (formType === "rental" && !editMode) {
                  handleGoToTourStep(4);
                } else if (formType === "facility" && !editMode) {
                  handleGoToTourStep(3);
                } else if (formType === "rental" && editMode) {
                  handleGoToTourStep(3);
                } else if (formType === "facility" && editMode) {
                  handleGoToTourStep(2);
                }
              }}
              type="button"
              className="text-orange-normal"
            >
              <ExclamationMark />
            </button>
          </div>
          <hr className="my-4" />
          <div className="mb-5 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
            <Select
              options={
                formType === "rental"
                  ? propertyCategories["rental property"]
                  : propertyCategories["gated estate/facility"]
              }
              id="category"
              label="Category"
              isSearchable={false}
              className="property-category-wrapper"
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              required
              hiddenInputClassName="property-form-input"
              onChange={(category) => setSelectedCategory(category)}
              defaultValue={editMode ? propertyDetails?.category : undefined}
            />
            <Input
              id="title"
              label={
                formType === "rental"
                  ? "Property Name"
                  : selectedCategory?.toLocaleLowerCase() === "estate"
                  ? "Estate Name"
                  : selectedCategory?.toLocaleLowerCase() === "facility"
                  ? "Facility Name"
                  : "Estate/Facility Name"
              }
              inputClassName="bg-white dark:bg-darkText-primary rounded-[8px] property-form-input"
              required
              className="property-name-wrapper"
              defaultValue={
                editMode ? propertyDetails?.property_title : undefined
              }
            />
            <Select
              id="state"
              options={getAllStates()}
              label="State"
              value={selectedState}
              className="property-state-wrapper"
              inputContainerClassName="bg-white"
              onChange={(state) => setPropertyState({ state })}
              required
              hiddenInputClassName="property-form-input"
            />

            <Select
              options={getLocalGovernments(selectedState)}
              id="local_government"
              label="local government"
              value={lga}
              inputContainerClassName="bg-white"
              onChange={(lga) => setPropertyState({ lga })}
              required
              hiddenInputClassName="property-form-input"
            />
            <Select
              options={getCities(selectedState, lga)}
              id="city_area"
              label="City / Area"
              allowCustom={true}
              value={city}
              onChange={(city) => setPropertyState({ city })}
              inputContainerClassName="bg-white"
              required
              hiddenInputClassName="property-form-input address-wrapper"
            />
            <RestrictInput
              id="full_address"
              label="Street Name/Number"
              inputClassName="bg-white rounded-[8px] property-form-input"
              required
              className="property-street-wrapper"
              defaultValue={
                editMode ? propertyDetails?.full_address : undefined
              }
              restrictedWordsOptions={{
                words: [
                  ...getAllStates(),
                  ...getAllLocalGovernments(),
                  ...getAllCities(),
                ],
              }}
            />

            {formType === "rental" && (
              <>
                <div className="coordinate-wrapper flex flex-col gap-2">
                  <label> Coordinates </label>
                  <div className="flex items-center px-2 h-12 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2">
                    <Modal>
                      <ModalTrigger asChild>
                        <button className="capitalize bg-brand-9 text-xs rounded-md px-2 text-white h-3/4">
                          Set Location
                        </button>
                      </ModalTrigger>
                      <ModalContent>
                        <GoogleMapsModal
                          setLat={setLat}
                          setLng={setLng}
                          setCoordinate={setCoordinate}
                          coordinate={coordinate as string}
                        />
                      </ModalContent>
                    </Modal>
                    <input
                      name="coordinate"
                      id="coordinate"
                      onChange={(e) => setCoordinate(e.target.value)}
                      value={coordinate}
                      type="text"
                      className="w-full h-full dark:bg-transparent rounded-[4px] outline-none px-2"
                    />
                    {coordinate && (
                      <button
                        type="button"
                        className="bg-transparent outline-none"
                        onClick={(e) => {
                          const previousSibling = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          if (previousSibling) {
                            setCoordinate("");
                            previousSibling.value = "";
                            e.stopPropagation();
                          } else {
                            console.warn("Previous sibling does not exist.");
                          }
                        }}
                      >
                        <DeleteIconX />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {!isFacility && (
              <SelectWithImage
                options={landlordOptions}
                id="land_lord_id"
                label="Landlord"
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                className="property-landlord-wrapper"
                value={landlordOptions.find(
                  (l) => l.value === selectedLandlord
                )}
                onChange={(value) => setSelectedLandlord(value)}
                hiddenInputClassName="property-form-input"
                placeholder={
                  landlordsLoading
                    ? "Loading landlords..."
                    : landlordsError
                    ? "Error loading landlords"
                    : "Select landlord"
                }
              />
            )}

            {isDirector && (
              <Select
                id="branch_id"
                required
                label="Branch"
                className="property-branch-wrapper"
                resetKey={resetKey}
                options={branchOptions}
                inputContainerClassName="bg-white"
                onChange={(selectedBranchId) =>
                  setPropertyState({
                    selectedBranch: {
                      value: selectedBranchId,
                      label:
                        branchOptions.find(
                          (branch) =>
                            String(branch.value) === String(selectedBranchId)
                        )?.label || "",
                    },
                  })
                }
                value={selectedBranch}
                hiddenInputClassName="property-form-input"
                placeholder={
                  branchesLoading
                    ? "Loading branches..."
                    : branchesError
                    ? "Error loading branches"
                    : "Select branch"
                }
                // error={branchesError}
              />
            )}

            {role !== "account" && (
              <SelectWithImage
                options={officerOptions}
                defaultValue={accountOfficerDefaultValue}
                id="account_officer_id"
                label="Account Manager"
                className="property-officer-wrapper"
                inputContainerClassName="bg-white"
                resetKey={resetKey}
                hiddenInputClassName="property-form-input"
                placeholder={
                  branchData.accountOfficer.loading
                    ? "Loading account manager..."
                    : branchData.accountOfficer.error
                    ? "Error loading account manager"
                    : "Select account manager"
                }
                disabled={branchData.accountOfficer.loading}
              />
            )}

            {/* Other Staff - Use memoized options and stable handlers */}
            <div className="property-staff-wrapper bg-transparent flex flex-col gap-2 self-end">
              <label className="text-text-label dark:text-darkText-2">
                Other Staff
              </label>
              <MultiSelect
                options={staffOption}
                onValueChange={handleStaffChange}
                value={selectedStaffs} // Use controlled value instead of defaultValue
                placeholder={
                  branchData.staff.loading
                    ? "Loading Other staff..."
                    : branchData.staff.error
                    ? "Error loading other staff"
                    : "Select Other staff"
                }
                disabled={branchData.staff.loading}
                variant="default"
                maxCount={1}
                className="property-staff-wrapper bg-white dark:bg-darkText-primary dark:border dark:border-solid dark:border-[#C1C2C366] hover:bg-white dark:hover:bg-darkText-primary text-black dark:text-white py-3"
              />
            </div>

            <TextArea
              id="description"
              label={
                formType === "rental"
                  ? "Property Description"
                  : selectedCategory?.toLocaleLowerCase() === "estate"
                  ? "Estate Description"
                  : selectedCategory?.toLocaleLowerCase() === "facility"
                  ? "Facility Description"
                  : "Estate/Facility Description"
              }
              className="property-description-wrapper md:col-span-2 lg:col-span-3 dark:text-white !dark:bg-transparent"
              placeholder="Write here"
              resetKey={resetKey}
              required={!isFacility}
              hiddenInputClassName="property-form-input"
              inputSpaceClassName="bg-white dark:bg-transparent"
              defaultValue={editMode ? propertyDetails?.description : undefined}
            />
          </div>
          {/* Property Settings */}
          <div className="flex gap-2 items-center">
            <p className="text-primary-navy dark:text-white font-bold text-lg lg:text-xl">
              <span className="text-status-error-primary">*</span>
              {formType === "rental"
                ? "Property Settings"
                : selectedCategory?.toLocaleLowerCase() === "estate"
                ? "Estate Settings"
                : selectedCategory?.toLocaleLowerCase() === "facility"
                ? "Facility Settings"
                : "Estate/Facility Settings"}
            </p>
            <button
              onClick={handleSectionTour}
              type="button"
              className="text-orange-normal"
            >
              <ExclamationMark />
            </button>
          </div>

          <hr className="my-4" />
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 dark:bg-darkText-primary dark:p-4 dark:rounded-lg">
            <Select
              id={formType === "rental" ? "agency_fee" : "management_fee"}
              label={formType === "rental" ? "Agency Fee" : "Management Fee"}
              options={[
                "1%",
                "2%",
                "2.5%",
                "3%",
                "3.5%",
                "5%",
                "6%",
                "7%",
                "7.5%",
                "8%",
                "9%",
                "10%",
              ]}
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              className="property-agency-fee-wrapper"
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode && formType === "rental"
                  ? `${propertySettings?.agency_fee}%`
                  : editMode && formType === "facility"
                  ? `${propertySettings?.management_fee}%`
                  : "5%"
              }
            />

            {formType === "facility" && (
              <>
                <Select
                  id="who_to_charge_new_tenant"
                  options={[
                    {
                      label: "Yes",
                      value: "tenants",
                    },
                    {
                      label: "No",
                      value: "none",
                    },
                  ]}
                  label="Enable Mgmt Fee – (New Occupant)"
                  isSearchable={false}
                  className="property-new-agency-fee-wrapper"
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  requiredNoStar
                  hiddenInputClassName="property-form-input"
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_new_tenant
                      : formType === "facility"
                      ? "no"
                      : "yes"
                  }
                />

                <Select
                  id="who_to_charge_renew_tenant"
                  className="property-renew-agency-fee-wrapper"
                  options={[
                    {
                      label: "Yes",
                      value: "tenants",
                    },
                    {
                      label: "No",
                      value: "none",
                    },
                  ]}
                  label="Enable Mgmt Fee – (Renewal Occupant)"
                  isSearchable={false}
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  requiredNoStar
                  hiddenInputClassName="property-form-input"
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_renew_tenant
                      : formType === "facility"
                      ? "no"
                      : "yes"
                  }
                />
              </>
            )}

            {formType === "rental" && (
              <>
                <Select
                  id="who_to_charge_new_tenant"
                  options={["landlord", "tenants", "both", "none"]}
                  label="Who to pay Agency Fee (New Rent)"
                  isSearchable={false}
                  className="property-new-agency-fee-wrapper"
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  requiredNoStar
                  hiddenInputClassName="property-form-input"
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_new_tenant
                      : "tenants"
                  }
                />
                <Select
                  id="who_to_charge_renew_tenant"
                  className="property-renew-agency-fee-wrapper"
                  options={["landlord", "tenants", "both", "none"]}
                  label="Management Fee (Renewal Rent)"
                  isSearchable={false}
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  requiredNoStar
                  hiddenInputClassName="property-form-input"
                  defaultValue={
                    editMode
                      ? propertySettings?.who_to_charge_renew_tenant
                      : "landlord"
                  }
                />
                <Select
                  options={filteredCautionDepositOptions}
                  isSearchable={false}
                  id="caution_deposit"
                  className="property-caution-deposit-wrapper"
                  label="Caution Deposit"
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  requiredNoStar
                  hiddenInputClassName="property-form-input"
                  defaultValue={
                    editMode ? propertySettings?.caution_deposit : "Escrow it"
                  }
                />
              </>
            )}

            {/* NOTE: I ADDED CURRENCY TO FACILITY PROPERTY CREATE FORM  */}
            <Select
              options={Object.entries(currencySymbols).map(([key, symbol]) => ({
                value: key.toLowerCase(),
                label: `${symbol} ${
                  key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
                }`,
              }))}
              id="currency"
              label="Currency"
              className="property-currency-wrapper"
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode && propertySettings?.currency
                  ? {
                      value: propertySettings.currency,
                      label: `${currencySymbols[propertySettings.currency]} ${
                        propertySettings.currency.charAt(0).toUpperCase() +
                        propertySettings.currency.slice(1).toLowerCase()
                      }`,
                    }
                  : {
                      value: "naira",
                      label: `${currencySymbols.naira} Naira`,
                    }
              }
            />

            <Select
              id="group_chat"
              label="Group Chat"
              options={["yes", "no"]}
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              className="property-group-chat-wrapper"
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode
                  ? propertySettings?.group_chat
                  : formType === "rental"
                  ? "yes"
                  : "no"
              }
            />
            <Select
              options={["yes", "no"]}
              id={formType === "rental" ? "rent_penalty" : "fee_penalty"}
              label={formType === "rental" ? "Rent Penalty" : "Fee Penalty"}
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              className="property-penalty-wrapper"
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode && formType === "rental"
                  ? propertySettings?.rent_penalty
                  : editMode && formType === "facility"
                  ? propertySettings?.fee_penalty
                  : "yes"
              }
            />
            <Select
              options={["yes", "no"]}
              id="request_call_back"
              label="Request Call Back"
              isSearchable={false}
              inputContainerClassName="bg-white"
              className="property-request-call-back-wrapper"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode ? propertySettings?.request_callback : "yes"
              }
            />
            <Select
              options={["yes", "no"]}
              id="book_visitors"
              label="Book Visitors"
              isSearchable={false}
              className="property-book-visitors-wrapper"
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
              defaultValue={
                editMode
                  ? propertySettings?.book_visitors
                  : formType === "rental"
                  ? "no"
                  : "yes"
              }
            />
            <Select
              options={["yes", "no"]}
              id="vehicle_record"
              className="property-vehicle-records-wrapper"
              label="Vehicle Records"
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
              defaultValue={editMode ? propertySettings?.vehicle_record : "no"}
            />
            <Select
              options={["yes", "no"]}
              id="active_vat"
              className="property-active-vat-wrapper"
              label="Activate 7.5% VAT"
              isSearchable={false}
              inputContainerClassName="bg-white"
              resetKey={resetKey}
              requiredNoStar
              hiddenInputClassName="property-form-input"
              defaultValue={editMode ? propertySettings?.VAT : "yes"}
            />

            {formType === "rental" && (
              <>
                <Select
                  options={["yes", "no"]}
                  id="is_inventory"
                  defaultValue={
                    editMode ? propertySettings?.is_inventory : "no"
                  }
                  label="Inventory"
                  inputContainerClassName="bg-white"
                  resetKey={resetKey}
                  className="property-inventory-wrapper"
                  hiddenInputClassName="property-form-input"
                />
              </>
            )}
          </div>
        </div>

        <div className="">
          <PropertyFormFooter
            editMode={editMode}
            handleReset={handleReset}
            requestLoading={requestLoading}
            propertyId={propertyId}
            onAddUnit={onAddUnit}
          />
        </div>
      </AuthForm>
    </FlowProgress>
  );
};

export default CreatePropertyForm;
