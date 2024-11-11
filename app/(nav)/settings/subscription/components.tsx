import Image from 'next/image'


export const ConfirmModal = ()=> {
    return (
        <div className="w-[326px] bg-white items-center justify-center h-[422px] rounded-lg">
            <div className="wrap bg-red-500 rounded-full">
            <div className="text-center">
                <Image
                    src='/icons/cancel-icon.svg'
                    width={35}
                    height={35}
                    alt='confirm'
                />
            </div>
            </div>
        </div>
    )
}