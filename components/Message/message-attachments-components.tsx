"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ModalTrigger } from '../Modal/modal'
import { CancelIcon, ChevronLeft } from '@/public/icons/icons'
import EmojiPicker from 'emoji-picker-react';
import { EmojiComponentProps } from './data';
import UploadMsgFile from './msg-file-upload';


export const MessageModalPreset = ({
    back,
    children,
    heading,
}: {
    heading: string,
    back?: { handleBack: () => void },
    children: React.ReactNode
}) => {
    return (
        <div className='w-[400px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white dark:bg-darkText-primary p-[20px] custom-flex-col'>
            <div className="flex items-center justify-between border-b border-solid border-gray-300 ">
                <div className='flex items-center gap-2'>
                    {back && (
                        <button
                            type="button"
                            onClick={back.handleBack}
                            aria-label="back"
                        >
                            <ChevronLeft />
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-primary-navy dark:text-white">
                        {heading}
                    </h2>
                </div>
                <ModalTrigger close>
                    <CancelIcon />
                </ModalTrigger>
            </div>
            {children}
        </div>
    )
}


// export const MessageAudioComponent: React.FC = () => {
//     const [isRecording, setIsRecording] = useState<boolean>(false);
//     const [audioURL, setAudioURL] = useState<string | null>(null);
//     const [timer, setTimer] = useState<number>(0);
//     const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

//     // References for MediaRecorder and audio chunks.
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const audioChunksRef = useRef<Blob[]>([]);

//     // Start recording using MediaRecorder.
//     const startRecording = async () => {
//         try {
//             // Request audio stream from the user.
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;
//             audioChunksRef.current = [];

//             // Collect audio chunks as they become available.
//             mediaRecorder.addEventListener("dataavailable", (event) => {
//                 if (event.data.size > 0) {
//                     audioChunksRef.current.push(event.data);
//                 }
//             });

//             // When recording stops, create a Blob and store its URL.
//             mediaRecorder.addEventListener("stop", () => {
//                 const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//                 const url = URL.createObjectURL(audioBlob);
//                 setAudioURL(url);
//             });

//             mediaRecorder.start();
//             setIsRecording(true);
//             setAudioURL(null);
//             setTimer(0);

//             // Start a timer that updates every second.
//             const id = setInterval(() => {
//                 setTimer((prev) => prev + 1);
//             }, 1000);
//             setIntervalId(id);
//         } catch (error) {
//             console.error("Failed to start recording:", error);
//         }
//     };

//     // Stop the recording and clear the timer.
//     const stopRecording = () => {
//         if (mediaRecorderRef.current && isRecording) {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//         if (intervalId) {
//             clearInterval(intervalId);
//             setIntervalId(null);
//         }
//     };

//     // Reset the recording state.
//     const resetRecording = () => {
//         setAudioURL(null);
//         setTimer(0);
//         setIsRecording(false);
//         if (intervalId) {
//             clearInterval(intervalId);
//             setIntervalId(null);
//         }
//         audioChunksRef.current = [];
//     };

//     return (
//         <div className="flex flex-col items-center p-4">
//             <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
//                 <div className="text-center mb-4">
//                     {isRecording ? (
//                         <div className="text-xl text-red-500 font-semibold">
//                             Recording... {timer}s
//                         </div>
//                     ) : (
//                         <div className="text-xl text-gray-700">
//                             {audioURL ? "Recording complete" : "Not recording"}
//                         </div>
//                     )}
//                 </div>
//                 <div className="flex gap-4 justify-center">
//                     {/* Start Recording Button */}
//                     {!isRecording && (
//                         <button
//                             onClick={startRecording}
//                             className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded shadow"
//                         >
//                             Start Recording
//                         </button>
//                     )}
//                     {/* Stop Recording Button */}
//                     {isRecording && (
//                         <button
//                             onClick={stopRecording}
//                             className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded shadow"
//                         >
//                             Stop Recording
//                         </button>
//                     )}
//                     {/* Reset Button (only when recording is complete) */}
//                     {audioURL && !isRecording && (
//                         <button
//                             onClick={resetRecording}
//                             className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded shadow"
//                         >
//                             Reset
//                         </button>
//                     )}
//                 </div>
//             </div>
//             {/* Audio Preview */}
//             {audioURL && (
//                 <div className="mt-6 w-full max-w-md">
//                     <p className="text-sm text-gray-600 mb-2">Preview:</p>
//                     <audio src={audioURL} controls className="w-full rounded" />
//                 </div>
//             )}
//         </div>
//     );
// };


export const MessageAudioComponent: React.FC = () => {
    const handleUpload = async (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const imageBase64 = reader.result as string;
                // setSignatureImageBase64(imageBase64);
                // setSignatureImageFile(file);
                // onCreateSignature(imageBase64, index, file);
                // setIsOpen(false);
            };
        }
    };
    return (
        <div className='mt-4'>
            <UploadMsgFile
                submitAction={handleUpload}
                accept=".mp3"
                heading='Upload Sound/Music'
            />
        </div>
    )
}

export const EmojiComponent: React.FC<EmojiComponentProps> = ({ onEmojiSelect }) => {
    const handleEmojiClick = (emojiData: any, event: MouseEvent) => {
        onEmojiSelect(emojiData.emoji);
    };

    return (
        <div className='my-4'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
    );
};



export const MessageGalleryComponent = () => {
    const handleUpload = async (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const imageBase64 = reader.result as string;
                // setSignatureImageBase64(imageBase64);
                // setSignatureImageFile(file);
                // onCreateSignature(imageBase64, index, file);
                // setIsOpen(false);
            };
        }
    };

    return (
        <div className='mt-4'>
            <UploadMsgFile
                submitAction={handleUpload}
                accept=".jpg, .jpeg, .png"
            />
        </div>
    )
}


export const MessageDocumentComponent = () => {
    const handleUpload = async (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const imageBase64 = reader.result as string;
                // setSignatureImageBase64(imageBase64);
                // setSignatureImageFile(file);
                // onCreateSignature(imageBase64, index, file);
                // setIsOpen(false);
            };
        }
    };
    return (
        <div className='mt-4'>
            <UploadMsgFile
                submitAction={handleUpload}
                heading='Import Document'
                accept=".pdf, .clx, .csv,.docx"
            />
        </div>
    )
}