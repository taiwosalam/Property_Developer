import { ModalContent, ModalTrigger } from "@/components/Modal/modal";

import { Modal } from "@/components/Modal/modal";

import PageTitle from "@/components/PageTitle/page-title";
import { Button } from "@/components/ui/button";

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div>
        <PageTitle
          title="Team Chat"
          aboutPageModalData={{
            title: "Team Chat",
            description:
              "This page contains a list of Team Chat on the platform.",
          }}
        />
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create Team Chat
            </Button>
          </ModalTrigger>
          <ModalContent>
            <div>text here</div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
