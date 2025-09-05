// Define a data type for our heroes
type Item = {
	id: number;
	title: string;
	desc: string;
};

// and another type for ListItem's props
type ListItemProps = {
	item: Item;
};

// Define a ListItem component
export default function ListItem({ item }: ListItemProps) {
	return (
		<li>
		{item.title}
		</li>
	);
}
