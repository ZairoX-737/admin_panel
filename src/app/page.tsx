'use client';
import { useRef, useState } from 'react';
import FileSaver from 'file-saver';

// затычка под бд
const categories = ['Категория 1', 'Категория 2', 'Категория 3', 'Категория 4'];
const tableData = [
	{
		id: 1,
		name: 'Иван Иванов',
		phone: '+7 999 111-22-33',
		address: 'Москва',
		event: 'Конференция',
	},
	{
		id: 2,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 3,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 4,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 5,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 6,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 7,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 8,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 9,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 10,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 11,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 12,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 13,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 14,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 15,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 16,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 17,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 18,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 19,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
	{
		id: 20,
		name: 'Петр Петров',
		phone: '+7 999 222-33-44',
		address: 'Санкт-Петербург',
		event: 'Семинар',
	},
];
// затычка под виды фильтров
const eventTypeOptions = ['Все', 'Конференция', 'Семинар', 'Вебинар'];

// Реф для контейнера таблицы
const tableContainerRef = useRef<HTMLDivElement>(null);

// типизация для поиска строки
type SearchField = 'id' | 'name' | 'phone' | 'address' | 'event';

// Функция для экранирования значений для CSV (переделать)
function escapeCSV(value: any) {
	return `"${String(value).replace(/"/g, '""')}"`;
}

// Функция экспорта данных в CSV (переделать)
function exportToCSV(data: any[], filename: string) {
	if (!data || data.length === 0) return;

	const csvContent = [
		Object.keys(data[0]).map(escapeCSV).join(','), // Заголовки
		...data.map(row => Object.values(row).map(escapeCSV).join(',')),
	].join('\n');

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	FileSaver.saveAs(blob, `${filename}.csv`);
}

export default function AdminPanel() {
	// стейты для категорий и фильтров
	const [selectedCategory, setSelectedCategory] = useState(categories[0]);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [selectedEventType, setSelectedEventType] = useState('Все');

	// стейт для таблички
	const [data, setData] = useState(tableData);

	// стейт для выделенной строки
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

	// стейт для отображения модалок
	const [modalState, setModalState] = useState<'add' | 'edit' | null>(null);

	// стейт для данных модалок (add/redact)
	const [formValues, setFormValues] = useState({
		name: '',
		phone: '',
		address: '',
		event: '',
	});

	// стейты для поиска строки
	const [searchField, setSearchField] = useState<SearchField>('id'); // ловит список
	const [searchQuery, setSearchQuery] = useState(''); // ловит вводимую строку

	// Вычисляемые данные: сначала фильтруем по виду мероприятия, затем сортируем по id
	const filteredData = data.filter(row => {
		if (selectedEventType !== 'Все') {
			return row.event === selectedEventType;
		}
		return true;
	});
	const sortedData = [...filteredData].sort((a, b) =>
		sortOrder === 'asc' ? a.id - b.id : b.id - a.id
	);

	// хэндлер на добавление новой строки
	const handleAddRow = () => {
		if (!validateForm()) {
			alert('Заполните обязательные поля (ФИО, Телефон, Направление)');
			return;
		}
		const newRow = {
			id: Date.now(),
			name: formValues.name,
			phone: formValues.phone,
			address: formValues.address,
			event: formValues.event,
		};
		setData([...data, newRow]);
		setFormValues({ name: '', phone: '', address: '', event: '' });
		setModalState(null);
	};

	// хэндлер на изменение строки
	const handleEditRow = () => {
		if (selectedRowId === null) return;
		const newData = data.map(row =>
			row.id === selectedRowId
				? {
						...row,
						name: formValues.name,
						phone: formValues.phone,
						address: formValues.address,
						event: formValues.event,
				  }
				: row
		);
		setData(newData);
		setFormValues({ name: '', phone: '', address: '', event: '' });
		setSelectedRowId(null);
		setModalState(null);
	};

	// хэндлер клика на строку таблицы
	const handleRowClick = (row: any) => {
		if (selectedRowId == row.id) {
			setSelectedRowId(null);
			return;
		}
		setSelectedRowId(row.id);
		setFormValues({
			name: row.name,
			phone: row.phone,
			address: row.address,
			event: row.event,
		});
	};

	//валидация формы
	const validateForm = () => {
		return (
			formValues.name.trim() !== '' &&
			formValues.phone.trim() !== '' &&
			formValues.event.trim() !== ''
		);
	};

	// хэндлер поиска строки
	const handleSearchRow = () => {
		const Query = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const foundRow = data.find(row => {
			const value = row[searchField];
			if (searchField === 'id') {
				return value === Number(Query);
			}
			return String(value).toLowerCase().includes(Query.toLowerCase());
		});
		if (foundRow) {
			const rowElement = document.getElementById(`row-${foundRow.id}`);
			if (rowElement && tableContainerRef.current) {
				const container = tableContainerRef.current;
				// Вычисляем смещение строки относительно контейнера
				const rowOffsetTop = rowElement.offsetTop;
				const containerHeight = container.clientHeight;
				const rowHeight = rowElement.clientHeight;
				// Вычисляем новое значение scrollTop так, чтобы строка оказалась по центру
				const newScrollTop = rowOffsetTop - containerHeight / 2 + rowHeight / 2;
				container.scrollTo({
					top: newScrollTop,
					behavior: 'smooth',
				});
				setSelectedRowId(foundRow.id);
				setFormValues({
					name: foundRow.name,
					phone: foundRow.phone,
					address: foundRow.address,
					event: foundRow.event,
				});
			}
		} else {
			alert('Строка не найдена');
		}
	};

	return (
		<div className='flex h-screen w-full'>
			{/* Сайдбар */}
			<aside className='w-1/6 bg-gray-800 text-white p-4'>
				<h2 className='text-2xl font-bold mb-6'>Категории</h2>
				<ul>
					{categories.map(category => (
						<li
							key={category}
							className={`p-2 m-1 cursor-pointer hover:bg-gray-700 transition-colors ${
								selectedCategory === category ? 'bg-gray-600' : ''
							}`}
							onClick={() => setSelectedCategory(category)}
						>
							{category}
						</li>
					))}
				</ul>
			</aside>

			{/* Основной блок */}
			<main className='flex-1 flex-col p-3 bg-gray-400 min-w-[300px]'>
				{/* Фильтры */}
				<section className='flex justify-between mb-6 p-3 bg-white rounded-lg shadow'>
					<div>
						<h3 className='text-lg font-semibold mb-0 text-slate-800'>
							Фильтры
						</h3>
						<div className='flex gap-3 flex-wrap'>
							{/* мероприятия */}
							<div className='flex flex-col'>
								<label className='mb-1 font-medium text-gray-700'>
									Тип мероприятия
								</label>
								<select
									id='eventType'
									className='p-1 border rounded-md text-gray-700'
									value={selectedEventType}
									onChange={e => setSelectedEventType(e.target.value)}
								>
									{eventTypeOptions.map(option => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>

							{/* сорт по id */}
							<div className='flex flex-col'>
								<label className='mb-1 font-medium text-gray-700'>
									Сортировка по ID
								</label>
								<select
									id='sortOrder'
									className='p-1 border rounded-md text-gray-700'
									value={sortOrder}
									onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
								>
									<option value='asc'>Возрастание</option>
									<option value='desc'>Убывание</option>
								</select>
							</div>
						</div>
					</div>
					{/* Поиск */}
					<div className='h-fit p-2 self-center bg-gray-100 rounded-lg'>
						<div className='flex flex-col md:flex-row gap-3 items-stretch'>
							<div className='max-w-fit flex flex-1 flex-col md:flex-row gap-2 text-stone-700'>
								<select
									className='max-w-fit md:w-48 p-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
									value={searchField}
									onChange={e => setSearchField(e.target.value as SearchField)}
								>
									<option value='id'>ID</option>
									<option value='name'>ФИО</option>
									<option value='phone'>Телефон</option>
									<option value='address'>Адрес</option>
									<option value='event'>Направление</option>
								</select>

								<div className='relative flex-1'>
									<input
										type='text'
										placeholder='Ввод...'
										className='min-w-40 w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>
							<button
								className='w-full md:w-auto px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2'
								onClick={handleSearchRow}
							>
								Найти
							</button>
						</div>
					</div>
				</section>

				{/* Таблица (желательно добавить либу для оптимизированных табличек) */}
				<section
					className='mb-6 p-3 bg-white shadow rounded-lg overflow-auto h-[65vh] min-h-[300px]'
					ref={tableContainerRef}
				>
					<table className='min-w-full border-collapse '>
						<thead className='bg-gray-400'>
							<tr className='text-stone-800'>
								<th className='border p-2 text-left'>ID</th>
								<th className='border p-2 text-left'>ФИО</th>
								<th className='border p-2 text-left'>Телефон спикера</th>
								<th className='border p-2 text-left'>Адрес</th>
								<th className='border p-2 text-left'>Направление</th>
							</tr>
						</thead>
						<tbody>
							{sortedData.map(row => (
								<tr
									key={row.id}
									id={`row-${row.id}`}
									className={`hover:bg-slate-400 cursor-pointer text-stone-700 transition-colors ${
										selectedRowId === row.id ? 'bg-red-300' : ''
									}`}
									onClick={() => handleRowClick(row)}
								>
									<td className='border p-2'>{row.id}</td>
									<td className='border p-2'>{row.name}</td>
									<td className='border p-2'>{row.phone}</td>
									<td className='border p-2'>{row.address}</td>
									<td className='border p-2'>{row.event}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>

				{/* Блок действий */}
				<section className='p-3 bg-white shadow rounded-lg flex justify-between gap-4'>
					<div className='flex gap-4 text-sm'>
						<button
							className='px-1 py-2 max-w-fit bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors'
							onClick={() => setModalState('add')}
						>
							Добавить новую строку
						</button>
						<button
							className='px-1 py-2 max-w-fit bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors'
							onClick={() => {
								if (selectedRowId) {
									setModalState('edit');
								}
							}}
							disabled={!selectedRowId}
						>
							Редактировать строку
						</button>
						<button
							className='px-1 py-2 max-w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
							onClick={() => exportToCSV(data, 'export')}
						>
							Выгрузить CSV
						</button>
					</div>
				</section>
			</main>

			{/* Модалка для добавления строки */}
			{modalState == 'add' && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 '>
					<div className='bg-white rounded-lg shadow-lg p-6 w-80'>
						<h3 className='text-xl font-semibold mb-4 text-stone-800'>
							Добавить новую строку
						</h3>
						<div className='flex flex-col gap-3 text-stone-700'>
							<input
								type='text'
								placeholder='ФИО'
								className='border p-2 rounded-md'
								value={formValues.name}
								onChange={e =>
									setFormValues({ ...formValues, name: e.target.value })
								}
							/>
							<input
								type='tel'
								placeholder='Телефон спикера'
								className='border p-2 rounded-md'
								value={formValues.phone}
								onChange={e =>
									setFormValues({ ...formValues, phone: e.target.value })
								}
							/>
							<input
								type='text'
								placeholder='Адрес'
								className='border p-2 rounded-md'
								value={formValues.address}
								onChange={e =>
									setFormValues({ ...formValues, address: e.target.value })
								}
							/>
							<input
								type='text'
								placeholder='Направление'
								className='border p-2 rounded-md'
								value={formValues.event}
								onChange={e =>
									setFormValues({ ...formValues, event: e.target.value })
								}
							/>
						</div>
						<div className='flex justify-end mt-4 gap-3'>
							<button
								className='px-4 py-2 bg-gray-500 text-white rounded-md'
								onClick={() => {
									setFormValues({
										name: '',
										phone: '',
										address: '',
										event: '',
									});
									setModalState(null);
								}}
							>
								Отмена
							</button>
							<button
								className='px-4 py-2 bg-green-600 text-white rounded-md'
								onClick={handleAddRow}
							>
								Добавить
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Модалка для редактирования строки */}
			{modalState == 'edit' && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-80'>
						<h3 className='text-xl font-semibold mb-4 text-stone-800'>
							Редактировать строку
						</h3>
						<div className='flex flex-col gap-3 text-stone-700'>
							<input
								type='text'
								placeholder='ФИО'
								className='border p-2 rounded-md '
								value={formValues.name}
								onChange={e =>
									setFormValues({ ...formValues, name: e.target.value })
								}
							/>
							<input
								type='tel'
								placeholder='Телефон спикера'
								className='border p-2 rounded-md'
								value={formValues.phone}
								onChange={e =>
									setFormValues({ ...formValues, phone: e.target.value })
								}
							/>
							<input
								type='text'
								placeholder='Адрес'
								className='border p-2 rounded-md'
								value={formValues.address}
								onChange={e =>
									setFormValues({ ...formValues, address: e.target.value })
								}
							/>
							<input
								type='text'
								placeholder='Направление'
								className='border p-2 rounded-md'
								value={formValues.event}
								onChange={e =>
									setFormValues({ ...formValues, event: e.target.value })
								}
							/>
						</div>
						<div className='flex justify-end mt-4 gap-3'>
							<button
								className='px-4 py-2 bg-gray-500 text-white rounded-md'
								onClick={() => {
									setFormValues({
										name: '',
										phone: '',
										address: '',
										event: '',
									});
									setModalState(null);
								}}
							>
								Отмена
							</button>
							<button
								className='px-4 py-2 bg-yellow-600 text-white rounded-md'
								onClick={handleEditRow}
							>
								Сохранить
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
