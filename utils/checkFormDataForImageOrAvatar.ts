export type InputData = FormData | Record<string, any>;

export function checkFormDataForImageOrAvatar(
  data: InputData,
  pictureField: string = "picture",
  avatarField: string = "avatar"
): boolean {
  let pictureFile: File | null | undefined;
  let avatarValue: string | null | undefined;

  if (data instanceof FormData) {
    pictureFile = data.get(pictureField) as File | null;
    avatarValue = data.get(avatarField) as string | null;
  } else {
    pictureFile = data[pictureField];
    avatarValue = data[avatarField];
  }

  // Check if the picture is a non-empty file
  const hasPicture = pictureFile instanceof File && pictureFile.size > 0;

  // Check if the avatar is not an empty string or null
  const hasAvatar =
    typeof avatarValue === "string" && avatarValue.trim() !== "";

  // Return true if either picture or avatar exists and is valid
  return hasPicture || hasAvatar;
}

export function cleanPhoneNumber(
  data: InputData,
  phoneNumberFields: string[] = ["phone_number"]
): void {
  phoneNumberFields.forEach((phoneNumberField) => {
    let phoneNumber: string | null | undefined;

    if (data instanceof FormData) {
      phoneNumber = data.get(phoneNumberField) as string | null;
      if (phoneNumber && phoneNumber.length <= 4) {
        data.delete(phoneNumberField);
      }
    } else {
      phoneNumber = data[phoneNumberField];
      if (phoneNumber && phoneNumber.length <= 4) {
        delete data[phoneNumberField];
      }
    }
  });
}

export function convertYesNoToBoolean(data: InputData, fields: string[]): void {
  fields.forEach((field) => {
    let value: string | null | undefined;

    if (data instanceof FormData) {
      value = data.get(field) as string | null;
      if (value?.toLowerCase() === "yes") {
        data.set(field, "1");
      } else if (value?.toLowerCase() === "no") {
        data.set(field, "0");
      }
    } else {
      value = data[field];
      if (value?.toLowerCase() === "yes") {
        data[field] = 1;
      } else if (value?.toLowerCase() === "no") {
        data[field] = 0;
      }
    }
  });
}

export const mapNumericToYesNo = (value?: 1 | 0) => {
  const mapping = {
    1: "Yes",
    0: "No",
  } as const;
  return value !== undefined ? mapping[value] : undefined;
};

export function objectToFormData(
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string
): FormData {
  const formData = form || new FormData();

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      const formKey = namespace ? `${namespace}[${property}]` : property;

      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        // If the property is an object, but not a File, use recursion.
        objectToFormData(obj[property], formData, formKey);
      } else {
        // If the property is a string or a File, append it to the FormData.
        formData.append(formKey, obj[property]);
      }
    }
  }

  return formData;
}
