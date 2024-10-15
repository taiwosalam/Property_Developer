const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createMaintenance = async (
  accessToken: string | null,
  data: any //change to formdata later
) => {
  try {
    const response = await fetch(`${BASE_URL}/maintenances`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      mode: "no-cors",
    }).then((res) => res.json());
    // console.log(response);
    return { success: true, data: response };
  } catch (error) {
    // console.error(error);
    return { success: false, error };
  }
};

export const getALLMaintenance = async (accessToken: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/maintenances`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    // console.error(error);
    return { success: false, error };
  }
};

export const getMaintenanceById = async (
  accessToken: string | null,
  id: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/maintenances/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    // console.error(error);
    return { success: false, error };
  }
};

export const updateMaintenance = async (
  accessToken: string | null,
  id: string,
  data: any //change to formdata later
) => {
  try {
    const response = await fetch(`${BASE_URL}/maintenances/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    // console.error(error);
    return { success: false, error };
  }
};

export const deleteMaintenance = async (
  accessToken: string | null,
  id: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/maintenances/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    // console.error(error);
    return { success: false, error };
  }
};


