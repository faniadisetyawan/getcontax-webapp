<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
        }

        td {
            width: 32mm;
            height: 19mm;
            border: 1px dashed #ccc;
            text-align: center;
            vertical-align: middle;
            padding: 1mm;
            box-sizing: border-box;
            overflow: hidden;
        }

        .label-name {
            font-size: 6pt;
            font-weight: bold;
            line-height: 1.1;
        }

        .label-price {
            font-size: 6pt;
            line-height: 1.1;
        }

        .barcode {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>

<body>
    <table>
        @php
            $cols = 6;
        @endphp

        @foreach (range(1, $quantity) as $i)
            @if ($loop->first || ($loop->iteration - 1) % $cols == 0)
                <tr>
            @endif

            <td>
                <div class="label-name">{{ $product->name }}</div>
                <img class="barcode"
                    src="data:image/png;base64,{{ DNS1D::getBarcodePNG($product->sku ?? $product->barcode, 'C128', 1, 33) }}" />
                <div class="label-price">Rp {{ number_format($product->price, 0, ',', '.') }}</div>
            </td>

            @if ($loop->iteration % $cols == 0 || $loop->last)
                @if ($loop->last && $loop->iteration % $cols != 0)
                    @for ($j = 0; $j < $cols - ($loop->iteration % $cols); $j++)
                        <td></td>
                    @endfor
                @endif
                </tr>
            @endif
        @endforeach
    </table>
</body>

</html>
