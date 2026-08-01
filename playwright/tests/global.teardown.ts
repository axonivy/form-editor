import { rm } from 'node:fs';

const teardown = () => {
  rm('./form-test-project/dialog/temp', { force: true, recursive: true }, () => {});
  rm('./form-test-project/src_generated/dataclass/temp', { force: true, recursive: true }, () => {});
};
export default teardown;
