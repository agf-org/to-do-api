/**
 * @swagger
 *
 * definitions:
 *   NewItem:
 *     type: object
 *     required:
 *       - text
 *       - done
 *     properties:
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 *   Item:
 *     type: object
 *     required:
 *       - _id
 *       - text
 *       - done
 *     properties:
 *       _id:
 *         type: string
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 *       __v:
 *         type: integer
 *   Items:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Item'
 *   Page:
 *     type: object
 *     required:
 *       - _id
 *       - items
 *     properties:
 *       _id:
 *         type: string
 *       items:
 *         type: array
 *         $ref: '#/definitions/Items'
 *       __v:
 *         type: integer
 *   Pages:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Page'
 */
