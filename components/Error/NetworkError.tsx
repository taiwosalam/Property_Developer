import { NetworkIcon } from "@/public/icons/icons";

const NetworkError = () => {
  return (
    <div className="flex flex-col gap-[15px] mt-12 px-6 md:px-20 mb-5">
      <div className="flex w-full items-center justify-center text-brand-9 mb-4">
        <NetworkIcon />
      </div>
      <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
        No network or error in internet connection.
      </p>

      <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
      <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
        <p>
          &ldquo;No network or error in internet connection&rdquo; means that
          your device is unable to establish a connection to the internet. This
          can occur due to various reasons, such as:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>No Network Coverage:</strong> Your device may be in an area
            with no Wi-Fi or mobile network coverage.
          </li>
          <li>
            <strong>Router or Modem Issues:</strong> The router or modem may be
            malfunctioning or not properly connected.
          </li>
          <li>
            <strong>Service Provider Outage:</strong> Your internet service
            provider might be experiencing an outage or technical difficulties.
          </li>
          <li>
            <strong>Incorrect Settings:</strong> Network settings on your device
            might be incorrect or misconfigured.
          </li>
          <li>
            <strong>Hardware Problems:</strong> There could be an issue with the
            network hardware, such as a damaged cable or a faulty network card.
          </li>
          <li>
            <strong>Overloaded Network:</strong> The network could be overloaded
            with too many users or devices, causing connectivity issues.
          </li>
          <li>
            <strong>Software Issues:</strong> Problems with the operating system
            or network drivers on your device could also cause connectivity
            errors.
          </li>
        </ul>

        <p>
          In this situation, you should check your network connections, restart
          your router or modem, verify your network settings, and contact your
          service provider if the problem persists.
        </p>
      </div>
    </div>
  );
};

export default NetworkError;
