import { useEffect, useState } from 'react';
import type { Set, Theme } from './types';

export default function App() {
    const [query, setQuery] = useState('');
    const [data, setData] = useState<undefined | null | (Set & { theme: Theme })>(undefined);

    useEffect(() => {
        // Only fetch data 0.5s after the user stops typing
        const timer = setTimeout(() => getData(), 500);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="bg-zinc-800 flex flex-col gap-5 p-10 items-center min-h-screen">
            <div className="bg-zinc-700 text-white flex flex-col gap-2 rounded-xl shadow-xl h-max p-5">
                <h1 className="font-bold text-xl">LEGO Set Lookup</h1>

                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        id="set_num"
                        autoComplete="off"
                        placeholder="Enter a set number..."
                        className="bg-zinc-600 text-white border-2 border-zinc-900 rounded-xl p-2"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {data && (
                <div className="bg-zinc-700 text-white flex flex-col gap-2 rounded-xl shadow-xl h-max p-5">
                    <h1 className="font-bold text-xl">{data.name}</h1>
                    <p>
                        <strong>Set Number:</strong> {data.set_num}
                        <br />
                        <strong>Year:</strong> {data.year}
                        <br />
                        <strong>Theme: </strong> {data.theme.name}
                    </p>

                    <img src={data.set_img_url} alt={data.name} className="rounded-md" />
                </div>
            )}

            {data === null && (
                <div className="bg-zinc-700 text-white flex flex-col gap-2 rounded-xl shadow-xl h-max p-5">
                    <h1 className="font-bold text-xl">No results found</h1>
                </div>
            )}
        </div>
    );

    function prepareId(number: string) {
        return number.includes('-') ? number : `${number}-1`;
    }

    async function getData() {
        // Only fetch data if the query is not empty and the query is valid
        if (!query) return setData(undefined);
        if (!query.match(/^[0-9\-]+$/)) return setData(null);

        // Add version to query if it doesn't exist
        const id = prepareId(query);

        // If the query is already set, don't fetch again
        if (data && data.set_num === id) return;

        const getSetUrl = (query: string) => `https://rebrickable.com/api/v3/lego/sets/${query}/`;
        const getThemeUrl = (query: string) => `https://rebrickable.com/api/v3/lego/themes/${query}/`;

        const headers = new Headers({ Authorization: `key ${process.env.REACT_APP_REBRICKABLE_KEY}` });

        // Get set data
        const getSet = () => fetch(getSetUrl(id), { headers }).then((res) => res.json());
        const set = await getSet().catch((err) => console.error(err));
        // If set result is not found, set null
        if (!set.set_num) return setData(null);

        // Get theme data
        const getTheme = () => fetch(getThemeUrl(set.theme_id), { headers }).then((res) => res.json());
        const theme = await getTheme().catch((err) => console.error(err));

        // Set data
        setData({
            ...set,
            theme,
        });
    }
}

/*

*/
