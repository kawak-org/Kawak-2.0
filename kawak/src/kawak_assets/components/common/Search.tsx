import React from "react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export type SearchOptionProps = {
	id: number;
	name: string;
	disabled?: boolean;
};

type Props = {
	className?: string;
	options: SearchOptionProps[];
};

const Search = ({ className, options }: Props) => {
	const [selected, setSelected] = useState<SearchOptionProps>(options[0]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className='relative'>
						<Listbox.Button
							className={
								"relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" +
								" " +
								className
							}
						>
							<span
								className={classNames(
									"block truncate",
									selected.disabled && "opacity-60"
								)}
							>
								{selected.name}
							</span>
							<span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
								<ChevronDownIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Listbox.Options className='absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
								{options.map((option) => (
									<Listbox.Option
										key={option.id}
										className={({ active, disabled }) =>
											classNames(
												!disabled && active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"cursor-default select-none relative py-2 px-3",
												disabled && "opacity-50"
											)
										}
										value={option}
										disabled={option.disabled}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? "font-semibold" : "font-normal",
														"block truncate"
													)}
												>
													{option.name}
												</span>
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default Search;
