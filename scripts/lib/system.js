import cmd from 'node-cmd';

/**
 * Run system command
 *
 * @param cmdString
 * @returns {Promise}
 */
const systemCmd = (cmdString) =>
  new Promise((resolve) => {
    cmd.run(cmdString, (data, err, stderr) => {
      console.log(cmdString);
      console.log(data);
      if (err) {
        console.log(err);
      }
      if (stderr) {
        console.log(stderr);
      }
      resolve(data);
    });
  });

export { systemCmd };
