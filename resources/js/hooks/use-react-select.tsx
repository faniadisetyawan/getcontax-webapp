import { StylesConfig } from "react-select";

const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const useReactSelectTheme = () => {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';

    const styles: StylesConfig = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: isDark ? 'var(--bs-body-bg)' : 'var(--bs-body-bg)',
            borderRadius: getCssVar('--bs-input-border-radius'),
            borderColor: state.isFocused
                ? isDark ? getCssVar('--bs-gray-600') : getCssVar('--bs-gray-400')
                : isDark ? getCssVar('--bs-gray-700') : getCssVar('--bs-gray-300'),
            boxShadow: 'none',
            '&:hover': {
                borderColor: isDark ? getCssVar('--bs-gray-600') : getCssVar('--bs-gray-400'),
            },
            padding: '0px',
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: '0.5rem 1rem',
        }),
        input: (provided: any) => ({
            ...provided,
            padding: '0px',
            margin: '0px',
            color: isDark ? 'var(--bs-light)' : 'var(--bs-dark)',
        }),
        placeholder: (base) => ({
            ...base,
            color: getCssVar('--bs-gray-500'),
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'var(--bs-primary)'
                : state.isFocused
                    ? isDark ? 'var(--bs-gray-800)' : 'var(--bs-gray-100)'
                    : isDark ? 'var(--bs-dark)' : 'var(--bs-white)',
            color: state.isSelected
                ? 'var(--bs-light)'
                : isDark ? 'var(--bs-gray-300)' : 'var(--bs-gray-900)',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: state.isSelected
                    ? 'var(--bs-primary)'
                    : isDark ? 'var(--bs-gray-800)' : 'var(--bs-gray-100)',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: isDark ? 'var(--bs-dark)' : 'var(--bs-white)',
            border: `1px solid ${isDark ? 'var(--bs-gray-700)' : 'var(--bs-gray-300)'}`,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: isDark ? 'var(--bs-light)' : 'var(--bs-dark)',
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: isDark ? 'var(--bs-gray-700)' : 'var(--bs-gray-200)',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: isDark ? 'var(--bs-light)' : 'var(--bs-dark)',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: isDark ? 'var(--bs-light)' : 'var(--bs-dark)',
            '&:hover': {
                backgroundColor: 'var(--bs-danger)',
                color: 'var(--bs-light)',
            },
        }),
    };

    return styles;
};

export default useReactSelectTheme;