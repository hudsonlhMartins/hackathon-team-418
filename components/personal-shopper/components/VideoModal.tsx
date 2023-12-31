import { StateUpdater, useMemo, useRef, useState } from "preact/hooks";
import { lazy, Suspense } from "preact/compat";
import ClientUtils from "../utils/ClientUtils.ts";
import {
  IMessage,
  Product,
  UserInfo,
} from "$store/components/personal-shopper/types.ts";
import Chat from "$store/components/personal-shopper/components/Chat.tsx";

const IconVideoOff = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video-off.tsx"
  )
);
const IconVideo = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video.tsx"
  )
);

const IconEarOff = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear-off.tsx"
  )
);
const IconEar = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear.tsx"
  )
);
const IconX = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx"
  )
);
const IconArrowsMaximize = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-maximize.tsx"
  )
);
const IconArrowsMinimize = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-minimize.tsx"
  )
);
const IconMessage = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/message.tsx"
  )
);

export interface Props {
  userProfile: UserInfo;
  modalOpened: boolean;
  product: Product;
  setUserProfile: StateUpdater<UserInfo | null | undefined>;
}

const VideoModal = (
  { userProfile, modalOpened, product, setUserProfile }: Props,
) => {
  const [audioOff, setAudioOff] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [videoFull, setVideoFull] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [contactActive, setContactActive] = useState({
    active: true,
    message: "",
  });
  const [messages, setMessages] = useState<IMessage[]>([]);

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const clientUtils = useMemo(
    () =>
      new ClientUtils(
        userProfile,
        product,
        setLocalStream,
        setMessages,
        setContactActive,
        myVideo,
        remoteVideo,
      ),
    [],
  );

  const handeMessage = (message: string) => {
    clientUtils.sendChatMessage(message);
  };

  const connectionRef = useRef(clientUtils.peerConn);


  

  if (!contactActive.active) {
    alert(contactActive.message);
    return <></>;
  }
  return (
    <div
      class={`${
        modalOpened ? "block" : "hidden"
      } mb-5 flex flex-col items-end max-w-[90vw]`}
    >
      {chatOpen &&
        (
          <Chat
            messages={messages}
            handleSendMessage={handeMessage}
            user="client"
          />
        )}
      <div class="flex justify-between w-full">
        <div>
          <button
            class="rounded-full bg-white shadow-md p-1 m-1"
            onClick={() => {
              setVideoFull((prev) => !prev);
              setChatOpen(false);
            }}
          >
            {videoFull
              ? (
                <Suspense fallback={<></>}>
                  <IconArrowsMinimize />
                </Suspense>
              )
              : (
                <Suspense fallback={<></>}>
                  <IconArrowsMaximize />
                </Suspense>
              )}
          </button>
          <button
            class="rounded-full bg-white shadow-md p-1 m-1"
            onClick={() => {
              setVideoFull(false);
              setChatOpen((prev) => !prev);
            }}
          >
            <Suspense fallback={<></>}>
              <IconMessage />
            </Suspense>
          </button>
        </div>
        <button
          class="rounded-full bg-red-400 shadow-md p-1 m-1"
          onClick={() => {
            setUserProfile(null);
            clientUtils.closeCall();
            connectionRef.current.close();
          }}
        >
          <Suspense fallback={<></>}>
            <IconX />
          </Suspense>
        </button>
      </div>
      <div id="video-call-div" class="relative max-w-full">
        <div
          class={`${
            !videoFull ? "w-20" : "w-40"
          } absolute bottom-0 right-0 transition-all`}
        >
          <video
            ref={myVideo}
            muted
            id="local-video"
            autoPlay
            class={`bg-black h-full w-full rounded-full border-2 border-white`}
          >
          </video>
        </div>
        <div
          class={`${
            !videoFull ? "w-64" : "w-[35rem]"
          } transition-all max-w-[90vw]`}
        >
          <video
            ref={remoteVideo}
            id="remote-video"
            autoPlay
            class={`bg-black h-full w-full`}
          >
          </video>
        </div>
        <div class="call-action-div">
          <button
            onClick={() => {
              setVideoOff((prev) => !prev);
              clientUtils.closeCamera(localStream);
            }}
            class={`rounded-full ${
              videoOff ? "bg-red-400" : "bg-white"
            } shadow-md p-1 m-1`}
          >
            {videoOff
              ? (
                <Suspense fallback={<></>}>
                  <IconVideoOff />
                </Suspense>
              )
              : (
                <Suspense fallback={<></>}>
                  <IconVideo />
                </Suspense>
              )}
          </button>
          <button
            onClick={() => {
              setAudioOff((prev) => !prev);
              clientUtils.muteAudio(localStream);
            }}
            class={`rounded-full ${
              audioOff ? "bg-red-400" : "bg-white"
            } shadow-md p-1 m-1`}
          >
            {audioOff
              ? (
                <Suspense fallback={<></>}>
                  <IconEarOff />
                </Suspense>
              )
              : (
                <Suspense fallback={<></>}>
                  <IconEar />
                </Suspense>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
