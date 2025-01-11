import { SearchErrorIcon } from "@/public/icons/icons";

const SearchError = () => {
  return (
    <div className="flex flex-col gap-[15px] mt-12 px-20">
      <div className="flex w-full items-center justify-center text-brand-9 mb-4">
        <SearchErrorIcon />
      </div>
      <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
      No Results Found
      </p>

      <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
      <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
        <p>
        We couldn&rsquo;t find any results matching your search. Here are some suggestions to help you refine your search or find what you&rsquo;re looking for:
        </p>

        <div className="flex flex-col gap-2">
            <h3 className="font-bold">Why You&rsquo;re Seeing This</h3>
            <ol className="list-decimal pl-6 space-y-2">
                <li>The keywords or query entered may not match any content in database.</li>
                <li>The item, service, or content you&rsquo;re searching for may not exist on the platform.</li>
                <li>There may be a typo or error in the search terms you entered.</li>
            </ol>
        </div>

        <div className="flex flex-col gap-2">
            <h3 className="font-bold">What Can You Do?</h3>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Check For Typos
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Ensure the search terms are spelled correctly.</li>
                    </ul>
                </li>
                <li>Try Broader Terms
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Use more general keywords to widen your search results.</li>
                    </ul>
                </li>
                <li>Use Fewer Keywords
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Simplify your query to improve the chances of finding relevant matches.</li>
                    </ul>
                </li>
                <li>Check Filters
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Explore the available filter option to locate what you need.</li>
                    </ul>
                </li>
                <li>Search Again
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Try searching with alternative terms or synonyms.</li>
                    </ul>
                </li>
            </ol>
        </div>
      </div>
    </div>
  );
};

export default SearchError;
