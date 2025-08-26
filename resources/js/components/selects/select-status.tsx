import useReactSelectTheme from "@/hooks/use-react-select";
import { Status } from "@/types/status";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

interface Props {
    value: number;
    onChange: (item: Status) => void;
    autoFocus?: boolean;
    placeholder?: string;
    isClearable?: boolean;
}

export default function SelectStatus({ value, onChange, placeholder = "Select Status", isClearable = false }: Props) {
    const reactSelectTheme = useReactSelectTheme();

    const [options, setOptions] = useState<Status[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: resp } = await axios.get(route('statuses.index'), {
                    params: {
                        json: true,
                    }
                });
                setOptions(resp?.map((item: Status) => ({
                    value: item.id,
                    label: item.name,
                    ...item,
                })))
            } catch (error) {
                setOptions([]);
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Select
            options={options}
            value={options?.find((val) => Number(val.id) === Number(value))}
            onChange={(val) => onChange(val as Status)}
            styles={reactSelectTheme}
            placeholder={placeholder}
            isClearable={isClearable}
        />
    )
}
