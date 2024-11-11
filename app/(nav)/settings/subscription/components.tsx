import Image from 'next/image'
import Xicon from '/icons/cancel-icon.svg'


export const ConfirmModal = ()=> {
    return (
        <div className="w-[326px] bg-white items-center justify-center h-[422px] rounded-lg">
            <div className="wrap bg-red-500 rounded-full">
            <div className="text-center">
                <Image
                    src={Xicon}
                    width={35}
                    height={35}
                    alt='confirm'
                />
            </div>
            </div>
        </div>
    )
}