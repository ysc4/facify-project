export const getStatusColor = (status) => {
    switch (status) {
        case "Pencil Booked": return "#FFF3B4";
        case "Officially Booked": return "#A6C4FF";
        case "For Assessing": return "#FFB951";
        case "Approved": return "#B3FFA6";
        case "Denied": return "#FFA6A6";
        case "Cancelled": return "#D9D9D9";
        case "Total Bookings": return "#262323";
        case "Scheduled Today": return "#FFB8D6";
        default: return "#FFFFFF"; 
    }
};
