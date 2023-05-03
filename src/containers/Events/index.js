import { useState } from 'react';
import EventCard from '../../components/EventCard';
import Select from '../../components/Select';
import { useData } from '../../contexts/DataContext';
import Modal from '../Modal';
import ModalEvent from '../ModalEvent';

import './style.css';

const PER_PAGE = 9;

const EventList = () => {
	const { data, error } = useData();
	const [type, setType] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	/* le filtre renvoi bien un tableau filtrer */
	const testFilter = type
		? data?.events.filter((event) => event.type === type)
		: data?.events;
	console.log(testFilter);
	/* on a a bien un filtrage mais avec un decalage + le par defaut ne fonctionne plus */

	const filteredEvents = ((type ? testFilter : data?.events) || []).filter(
		(_, index) => {
			if (
				(currentPage - 1) * PER_PAGE <= index &&
				PER_PAGE * currentPage > index
			) {
				return true;
			}
			return false;
		}
	);

	const changeType = (evtType) => {
		setCurrentPage(1);
		setType(evtType);
		console.log(evtType);
	};
	const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
	const typeList = new Set(data?.events.map((event) => event.type));
	/*  renvoi les events disponible dans le selecteur */

	console.log(typeList);
	return (
		<>
			{error && <div>An error occured</div>}
			{data === null ? (
				'loading'
			) : (
				<>
					<h3 className="SelectTitle">Catégories</h3>
					<Select
						selection={Array.from(typeList)}
						/* le trigger onChange se declenche trop tôt , changeType est appelé avant que la value soit a jour */
						onChange={() =>
							document.getElementById('selectedType').value
								? changeType(
										document.getElementById('selectedType')
											.value
								  )
								: changeType(null)
						}
					/>
					<div id="events" className="ListContainer">
						{testFilter.map((event) => (
							<Modal
								key={event.id}
								Content={<ModalEvent event={event} />}
							>
								{({ setIsOpened }) => (
									<EventCard
										onClick={() => setIsOpened(true)}
										imageSrc={event.cover}
										title={event.title}
										date={new Date(event.date)}
										label={event.type}
										/* Toute les périodes insique 24-25-26 février ??? dans le JSON */
									/>
								)}
							</Modal>
						))}
					</div>
					<div className="Pagination">
						{[...Array(pageNumber || 0)].map((_, n) => (
							// eslint-disable-next-line react/no-array-index-key
							<a
								key={n.index}
								href="#events"
								onClick={() => setCurrentPage(n + 1)}
							>
								{n + 1}
							</a>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default EventList;
