const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  // eslint-disable-next-line no-param-reassign
  schema.statics.paginateMess = async function (groupArray, filter, options) {
    // eslint-disable-next-line no-param-reassign
    options.populate = 'user';
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    // console.log('user', userR);
    const { key } = filter;
    // const valueE = { $regex: key, $ne: userR.user.email || '', $options: 'i' };
    // const valueS = { $regex: key, $ne: userR.subname || '', $options: 'i' };
    // const valueU = { $regex: key, $ne: userR.user.username || '', $options: 'i' };
    const value = {
      $regex: key,
      $options: 'i',
    };

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments({
      user: {
        $nin: groupArray,
      },
      $or: [{ email: value }, { subname: value }, { username: value }],
    }).exec();
    let docsPromise = this.find({
      user: {
        $nin: groupArray,
      },
      $or: [{ email: value }, { subname: value }, { username: value }],
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      // eslint-disable-next-line prefer-const
      let [totalResults, results] = values;

      // JSON.parse(JSON.stringify(user));
      // eslint-disable-next-line no-restricted-syntax

      // eslint-disable-next-line no-restricted-syntax
      const users = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const i of results) {
        const userN = JSON.parse(JSON.stringify(i));
        delete userN.user.isActivated;
        delete userN.user.role;
        delete userN.user.isBanned;
        users.push(i);
      }
      results = users;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
