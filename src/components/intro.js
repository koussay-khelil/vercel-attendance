import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    margin: "auto",
  },
}));

export default function Intro({ eventImageUrl }) {
  const classes = useStyles();
  return (
    <div class='xl:pb-8 lg:pb-6 md:pb-4 sm:pb-2'>
      <div className={classes.root}>
        <img
          className={classes.image}
          src={eventImageUrl}
          alt="event"
        />
      </div>
    </div>
  );
}
