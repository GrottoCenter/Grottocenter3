/**
 * EntranceController
 *
 * @description :: Server-side logic for managing entrances
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// Extract everything from the request body except id
const getConvertedDataFromClientRequest = (req) => {
  const { id, ...reqBodyWithoutId } = req.body; // remove id if present to avoid null id (and an error)
  return {
    ...reqBodyWithoutId,
    author: req.token.id,
    cave: ramda.pathOr(undefined, ['cave', 'id'], req.body),
  };
};

module.exports = {
  find: (req, res, converter) => {
    TEntrance.findOne({
      id: req.params.id,
    })
      .populate('author')
      .populate('cave')
      .populate('names')
      .populate('descriptions')
      .populate('geology')
      .populate('locations')
      .populate('documents')
      .populate('riggings')
      .populate('comments')
      .exec((err, found) => {
        const params = {};
        params.searchedItem = `Entrance of id ${req.params.id}`;

        if (!found) {
          const notFoundMessage = `${params.searchedItem} not found`;
          sails.log.debug(notFoundMessage);
          res.status(404);
          return res.json({ error: notFoundMessage });
        }

        // Populate stats
        const statsPromise = CommentService.getStats(req.params.id);
        statsPromise.then((stats) => {
          found.stats = stats;
          if (!found.isPublic) {
            // TODO: Some people (admin ? use RightHelper with a right in DB ?) should be able to get the full data even for the "not public" entrances.
            delete found.locations;
            delete found.longitude;
            delete found.latitude;
          }
          return ControllerService.treatAndConvert(
            req,
            err,
            found,
            params,
            res,
            converter,
          );
        });
      });
  },

  findRandom: (
    req,
    res,
    next,
    converter = MappingV1Service.convertToEntranceModel,
  ) => {
    const params = {};
    params.searchedItem = `Random entrance`;
    EntranceService.findRandom()
      .then((result) => {
        if (!result) {
          return res.notFound();
        }
        return ControllerService.treatAndConvert(
          req,
          null,
          result,
          params,
          res,
          converter,
        );
      })
      .catch((err) => {
        return ControllerService.treatAndConvert(
          req,
          err,
          undefined,
          params,
          res,
          converter,
        );
      });
  },

  publicCount: (req, res, converter) => {
    TEntrance.count({ isPublic: true })
      .then((total) => {
        return res.json(converter({ count: total }));
      })
      .catch((err) => {
        const errorMessage =
          'An internal error occurred when getting number of public entrances';
        sails.log.error(`${errorMessage}: ${err}`);
        return res.status(500).json({ error: errorMessage });
      });
  },

  count: (req, res) => {
    TEntrance.count().exec((err, found) => {
      const params = {};
      params.controllerMethod = 'EntranceController.count';
      params.notFoundMessage = 'Problem while getting number of entrances.';

      const count = {};
      count.count = found;
      return ControllerService.treat(req, err, count, params, res);
    });
  },

  create: (req, res, next) => async (req, res) => {
    // Check right
    // TODO: uncomment when right check is available
    /*
    const hasRight = await sails.helpers.checkRight
      .with({
        groups: req.token.groups,
        // TODO: update rights with the latest ones (ENTRANCE & CREATE)
        rightEntity: RightService.RightEntities.ENTRY,
        rightAction: RightService.RightActions.EDIT_ALL,
      })
      .intercept('rightNotFound', (err) => {
        return res.serverError(
          'A server error occured when checking your right to create an entrance.',
        );
      });
    if (!hasRight) {
      return res.forbidden('You are not authorized to create an entrance.');
    }
    */

    const cleanedData = {
      ...getConvertedDataFromClient(req),
      dateInscription: new Date(),
    };
    /*
    // Launch creation request using transaction: it performs a rollback if an error occurs
    await sails
      .getDatastore()
      .transaction(async (db) => {
        const documentCreated = await TDocument.create(cleanedData)
          .fetch()
          .usingConnection(db);

        // Create associated data not handled by TDocument manually
        if (ramda.pathOr(null, ['documentMainLanguage', 'id'], req.body)) {
          await JDocumentLanguage.create({
            document: documentCreated.id,
            language: req.body.documentMainLanguage.id,
            isMain: true,
          }).usingConnection(db);
        }

        await TDescription.create({
          author: req.token.id,
          body: req.body.description,
          dateInscription: new Date(),
          document: documentCreated.id,
          language: req.body.titleAndDescriptionLanguage.id,
          title: req.body.title,
        }).usingConnection(db);

        const params = {};
        params.controllerMethod = 'DocumentController.create';
        return ControllerService.treat(req, null, documentCreated, params, res);
      })
      .intercept('E_UNIQUE', () => res.sendStatus(409))
      .intercept('UsageError', (e) => res.badRequest(e.cause.message))
      .intercept('AdapterError', (e) => res.badRequest(e.cause.message))
      .intercept((e) => res.serverError(e.message));
    */
  },
};
