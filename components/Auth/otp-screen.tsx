import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
import { AuthForm } from "./auth-components";

const OtpScreen = () => {
  return (
    <AuthForm className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Email address"
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">Verify</Button>
      </div>
    </AuthForm>
  );
};

export default OtpScreen;
