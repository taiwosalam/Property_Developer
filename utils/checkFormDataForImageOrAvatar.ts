type InputData = FormData | Record<string, any>;

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
