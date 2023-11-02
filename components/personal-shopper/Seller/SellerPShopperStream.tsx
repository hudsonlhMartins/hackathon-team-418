import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import SellerUtils from "../utils/SellerUtils.ts";
import { Contact } from "$store/components/personal-shopper/types.ts";
import ContactCard from "$store/components/personal-shopper/components/ContactCard.tsx";
import VideoModal from "$store/components/personal-shopper/components/VideoModal.tsx";
import VideoModalSeller from "$store/islands/VideoModalSeller.tsx";
import { checkAuth, checkSeller } from "$store/components/personal-shopper/utils/utils.ts";

export interface Props {}
const SellerPShopperStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [contact, setContact] = useState<Contact | null>(null);
  
  

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  //TODO: leave call com connectionRef.current.destroy()
  // const connectionRef= useRef<any>(null)

  const sellerUtils = useRef<SellerUtils | null>(null);


  const handleJoin = async () => {
    await sellerUtils?.current?.setUsername(
      contact?.userInfo?.Email ?? "",
    );
    sellerUtils?.current?.joinCall(
      setLocalStream,
      myVideo,
      remoteVideo,
    );
  };

  useEffect(() => {

    const checkSellerAuth = async ()=>{


      sellerUtils.current = new SellerUtils(setContact);
  
      const initializeSeller = async () => {
        if (sellerUtils?.current?.webSocket.readyState !== 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          initializeSeller();
          return;
        }
        await sellerUtils?.current?.sendSellerName(
          "teste@teste.com",
          "/8/18/20",
        );
      };
      initializeSeller();
    }



    checkSellerAuth()
  }, [sellerUtils]);

  return (
    <div
      class={`flex fixed top-[10%] left-[50%] translate-x-[-50%]  border rounded-md p-6`}
    >
      {contact
        ? (
          <>
            <ContactCard contact={contact} handleJoin={handleJoin} />

            <VideoModalSeller
              localStream={localStream}
              remoteVideo={remoteVideo}
              myVideo={myVideo}
              sellerUtils={sellerUtils}
            />
          </>
        )
        : (
          <div>
            <h1 class="text-xl font-semibold">Não houve contato</h1>
          </div>
        )}
    </div>
  );
};

export default SellerPShopperStream;
