import Button from '@material-ui/core/Button';

interface IWelcomeProps {
  openAddDialog: () => void,
}

const Welcome = (props: IWelcomeProps) => {
  const { openAddDialog } = props;

  return (
    <>
      <div className="flex-row">
        Please add and investment
        <Button
          onClick={openAddDialog}
          variant="outlined"
          color="primary"
        >
          Add
        </Button>
      </div>
    </>
  );
};

export default Welcome;
