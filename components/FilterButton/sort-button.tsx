import { ArrowDownAZ, ArrowUpZA } from 'lucide-react'
import { useState } from 'react'

const SortButton = () => {
    const [sort, setSort] = useState('asc')
    const toggleSort = () => {
        setSort(sort === 'asc' ? 'desc' : 'asc')
    }
    return (
        <button
            type="button"
            className="bg-white rounded-lg p-2 flex items-center gap-2"
            onClick={toggleSort}
        >
            {sort === 'asc' ? <ArrowDownAZ size={20} /> : <ArrowUpZA size={20} />}
            <span className="text-[#344054] text-base font-medium">Sort</span>
        </button>
    )
}

export default SortButton